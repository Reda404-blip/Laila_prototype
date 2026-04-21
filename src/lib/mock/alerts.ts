import { getApprovalSummaries } from "@/lib/mock/approvals";
import { getControlChecklistSummaries } from "@/lib/mock/controls";
import { getDeclarationRiskSnapshots } from "@/lib/mock/risk";

export type AlertSeverity = "Info" | "Warning" | "High" | "Critical";
export type AlertStatus = "Open" | "Acknowledged" | "Resolved";
export type AlertSource = "Risk" | "Controls" | "Approvals";

export type AlertRecord = {
  id: string;
  declarationId: string;
  clientName: string;
  obligationLabel: string;
  periodLabel: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: AlertSource;
  title: string;
  message: string;
  owner: string;
  dueDate: string;
  triggeredAt: string;
};

const alerts: AlertRecord[] = (() => {
  const risks = getDeclarationRiskSnapshots();
  const controls = getControlChecklistSummaries();
  const approvals = getApprovalSummaries();

  const riskAlerts = risks
    .filter((item) => item.totalScore >= 60)
    .map<AlertRecord>((item, index) => ({
      id: `alert-risk-${index + 1}`,
      declarationId: item.declarationId,
      clientName: item.clientName,
      obligationLabel: item.obligationLabel,
      periodLabel: item.periodLabel,
      severity: item.riskLevel === "Critical" ? "Critical" : "High",
      status: "Open",
      source: "Risk",
      title: `${item.riskLevel} risque declaratif detecte`,
      message: item.triggeredRules.slice(0, 2).join(" / "),
      owner: "Youssef Bennani",
      dueDate: item.dueDate,
      triggeredAt: "19/04/2026 08:30",
    }));

  const controlAlerts = controls
    .filter((item) => item.failedControls > 0 || item.mandatoryRemaining > 0)
    .map<AlertRecord>((item, index) => ({
      id: `alert-control-${index + 1}`,
      declarationId: item.declarationId,
      clientName: item.clientName,
      obligationLabel: item.obligationLabel,
      periodLabel: item.periodLabel,
      severity: item.failedControls > 0 ? "Critical" : "Warning",
      status: item.readyForReview ? "Resolved" : "Open",
      source: "Controls",
      title: "Les controles obligatoires bloquent encore l'avancement",
      message: `${item.mandatoryRemaining} obligatoires ouverts / ${item.failedControls} controles en echec`,
      owner: "Nadia Tazi",
      dueDate: item.dueDate,
      triggeredAt: "19/04/2026 08:45",
    }));

  const approvalAlerts = approvals
    .filter(
      (item) =>
        item.currentDecision === "Pending" || item.currentDecision === "Returned",
    )
    .map<AlertRecord>((item, index) => ({
      id: `alert-approval-${index + 1}`,
      declarationId: item.declarationId,
      clientName: item.clientName,
      obligationLabel: item.obligationLabel,
      periodLabel: item.periodLabel,
      severity: item.currentDecision === "Returned" ? "High" : "Warning",
      status: item.currentDecision === "Returned" ? "Acknowledged" : "Open",
      source: "Approvals",
      title:
        item.currentDecision === "Returned"
          ? "Le relecteur a retourne le dossier"
          : "Decision d'approbation toujours en attente",
      message: `${item.currentStage} gate gere par ${item.nextActor}`,
      owner: item.nextActor,
      dueDate: item.dueDate,
      triggeredAt: "19/04/2026 09:00",
    }));

  return [...riskAlerts, ...controlAlerts, ...approvalAlerts].sort((left, right) =>
    left.severity === right.severity ? left.clientName.localeCompare(right.clientName) : 0,
  );
})();

export function getAlerts() {
  return alerts;
}

export function getAlertsByDeclarationId(declarationId: string) {
  return alerts.filter((alert) => alert.declarationId === declarationId);
}

export function getAlertSummary() {
  return {
    total: alerts.length,
    critical: alerts.filter((item) => item.severity === "Critical").length,
    open: alerts.filter((item) => item.status === "Open").length,
    acknowledged: alerts.filter((item) => item.status === "Acknowledged").length,
  };
}

