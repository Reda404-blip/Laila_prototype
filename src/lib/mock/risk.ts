import { declarations } from "@/lib/mock/declarations";
import { getDocumentsByDeclarationId, getDocumentRequestsByDeclarationId } from "@/lib/mock/documents";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type DeclarationRiskSnapshot = {
  declarationId: string;
  clientId: string;
  clientName: string;
  obligationLabel: string;
  periodLabel: string;
  dueDate: string;
  status: string;
  totalScore: number;
  riskLevel: RiskLevel;
  deadlineScore: number;
  documentScore: number;
  consistencyScore: number;
  workflowScore: number;
  behaviorScore: number;
  primaryDriver: string;
  triggeredRules: string[];
};

export type ClientRiskSnapshot = {
  clientId: string;
  clientName: string;
  totalScore: number;
  riskLevel: RiskLevel;
  openDeclarations: number;
  overdueRequests: number;
  nextDeadline: string;
  highestRiskDeclarationId: string;
  keyDrivers: string[];
};

const REFERENCE_DATE = new Date(2026, 3, 19);

function parseDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function daysUntil(value: string) {
  const dueDate = parseDate(value);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((dueDate.getTime() - REFERENCE_DATE.getTime()) / msPerDay);
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}

function getDeadlineScore(dueDate: string) {
  const remainingDays = daysUntil(dueDate);

  if (remainingDays <= 0) return 25;
  if (remainingDays <= 1) return 23;
  if (remainingDays <= 3) return 20;
  if (remainingDays <= 7) return 14;
  if (remainingDays <= 15) return 8;
  return 2;
}

function extractPercentage(context: string) {
  const match = context.match(/([+-]?\d+(?:\.\d+)?)%/);
  return match ? Math.abs(Number(match[1])) : 0;
}

export function getDeclarationRiskSnapshots(): DeclarationRiskSnapshot[] {
  return declarations
    .map((declaration) => {
      const requests = getDocumentRequestsByDeclarationId(declaration.id);
      const linkedDocuments = getDocumentsByDeclarationId(declaration.id);

      const overdueMandatory = requests.filter(
        (request) => request.mandatory && request.status === "Overdue",
      ).length;
      const pendingMandatory = requests.filter(
        (request) =>
          request.mandatory &&
          (request.status === "Requested" || request.status === "Received"),
      ).length;

      const deadlineScore = getDeadlineScore(declaration.dueDate);

      const documentScore = Math.min(
        25,
        overdueMandatory * 10 +
          pendingMandatory * 6 +
          declaration.missingDocuments * 2 +
          Math.max(0, requests.length - linkedDocuments.length),
      );

      const workflowBaseByStatus: Record<string, number> = {
        "Pending docs": 10,
        "In preparation": 8,
        "Pending review": 5,
        "Pending approval": 2,
        Approved: 0,
      };

      const workflowScore = Math.min(
        20,
        (workflowBaseByStatus[declaration.status] ?? 0) +
          (declaration.checklistCompletion < 60
            ? 10
            : declaration.checklistCompletion < 80
              ? 6
              : declaration.checklistCompletion < 100
                ? 2
                : 0),
      );

      const consistencySignals = [
        ...declaration.metrics.map((metric) => metric.context),
        ...declaration.blockers,
      ].join(" ");

      let consistencyScore = 0;
      const percentage = extractPercentage(consistencySignals);

      if (/anomaly/i.test(consistencySignals)) consistencyScore += 10;
      if (/above portfolio median/i.test(consistencySignals)) consistencyScore += 8;
      if (/variance/i.test(consistencySignals)) consistencyScore += 6;
      if (percentage >= 15) consistencyScore += 8;
      else if (percentage >= 7) consistencyScore += 4;
      consistencyScore = Math.min(20, consistencyScore);

      const behaviorScore = Math.min(
        10,
        overdueMandatory > 0
          ? 10
          : pendingMandatory > 0
            ? 6
            : declaration.missingDocuments > 0
              ? 3
              : 0,
      );

      const componentEntries = [
        { label: "Pression echeance", value: deadlineScore },
        { label: "Manques documentaires", value: documentScore },
        { label: "Faiblesse workflow", value: workflowScore },
        { label: "Anomalie de coherence", value: consistencyScore },
        { label: "Comportement client", value: behaviorScore },
      ];

      const triggeredRules: string[] = [];

      if (daysUntil(declaration.dueDate) <= 1) {
        triggeredRules.push("L'echeance est dans les 24 heures ou deja depassee.");
      } else if (daysUntil(declaration.dueDate) <= 7) {
        triggeredRules.push("L'echeance arrive dans les 7 prochains jours.");
      }

      if (overdueMandatory > 0) {
        triggeredRules.push("Des demandes documentaires obligatoires sont en retard.");
      }

      if (pendingMandatory > 0) {
        triggeredRules.push("Des demandes documentaires obligatoires sont encore en attente.");
      }

      if (declaration.checklistCompletion < 80) {
        triggeredRules.push("Le taux de checklist est sous le seuil de controle.");
      }

      if (consistencyScore > 0) {
        triggeredRules.push("Le contexte metrique indique une incoherence ou une anomalie.");
      }

      const totalScore = Math.min(
        100,
        deadlineScore +
          documentScore +
          workflowScore +
          consistencyScore +
          behaviorScore,
      );

      return {
        declarationId: declaration.id,
        clientId: declaration.clientId,
        clientName: declaration.clientName,
        obligationLabel: declaration.obligationLabel,
        periodLabel: declaration.periodLabel,
        dueDate: declaration.dueDate,
        status: declaration.status,
        totalScore,
        riskLevel: getRiskLevel(totalScore),
        deadlineScore,
        documentScore,
        consistencyScore,
        workflowScore,
        behaviorScore,
        primaryDriver: componentEntries.sort((a, b) => b.value - a.value)[0].label,
        triggeredRules,
      };
    })
    .sort((left, right) => right.totalScore - left.totalScore);
}

export function getClientRiskSnapshots(): ClientRiskSnapshot[] {
  const declarationSnapshots = getDeclarationRiskSnapshots();
  const grouped = new Map<string, DeclarationRiskSnapshot[]>();

  for (const snapshot of declarationSnapshots) {
    const current = grouped.get(snapshot.clientId) ?? [];
    current.push(snapshot);
    grouped.set(snapshot.clientId, current);
  }

  return Array.from(grouped.entries())
    .map(([clientId, snapshots]) => {
      const highest = snapshots[0];
      const allRequests = snapshots.flatMap((snapshot) =>
        getDocumentRequestsByDeclarationId(snapshot.declarationId),
      );

      return {
        clientId,
        clientName: highest.clientName,
        totalScore: highest.totalScore,
        riskLevel: highest.riskLevel,
        openDeclarations: snapshots.length,
        overdueRequests: allRequests.filter((request) => request.status === "Overdue")
          .length,
        nextDeadline: snapshots
          .map((snapshot) => snapshot.dueDate)
          .sort((left, right) => parseDate(left).getTime() - parseDate(right).getTime())[0],
        highestRiskDeclarationId: highest.declarationId,
        keyDrivers: Array.from(
          new Set(snapshots.flatMap((snapshot) => snapshot.triggeredRules)),
        ).slice(0, 3),
      };
    })
    .sort((left, right) => right.totalScore - left.totalScore);
}

