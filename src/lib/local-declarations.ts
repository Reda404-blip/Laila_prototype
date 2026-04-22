import type {
  DeclarationRecord,
  DeclarationRiskLevel,
  DeclarationStatus,
} from "@/lib/mock/declarations";

export const LOCAL_DECLARATIONS_KEY = "laila.createdDeclarations.v1";
export const LOCAL_DECLARATIONS_EVENT = "laila:local-declarations-updated";

export type LocalControlStatus = "Pending" | "Completed" | "Failed";

export type LocalControlItem = {
  id: string;
  title: string;
  category: string;
  mandatory: boolean;
  status: LocalControlStatus;
  owner: string;
  note: string;
};

export type LocalDocumentRequest = {
  id: string;
  title: string;
  dueDate: string;
  status: "Demandee" | "En retard" | "Recue";
  mandatory: boolean;
};

export type LocalDeclarationRecord = DeclarationRecord & {
  source: "local";
  createdAt: string;
  clientType: "PME" | "TPE";
  legalForm: string;
  city: string;
  documentsReceived: number;
  riskScore: number;
  primaryDriver: string;
  generatedRules: string[];
  generatedControls: LocalControlItem[];
  documentRequests: LocalDocumentRequest[];
};

export type NewDeclarationFormValues = {
  clientName: string;
  clientType: "PME" | "TPE";
  legalForm: string;
  city: string;
  obligationCode: string;
  obligationLabel: string;
  periodLabel: string;
  dueDate: string;
  totalAmount: string;
  preparer: string;
  reviewer: string;
  missingDocuments: number;
  documentsReceived: number;
  checklistCompletion: number;
  hasConsistencyAlert: boolean;
  clientBehavior: "Normal" | "Retard leger" | "Retard recurrent";
  notes: string;
};

export type RiskCalculationResult = {
  score: number;
  level: DeclarationRiskLevel;
  status: DeclarationStatus;
  primaryDriver: string;
  rules: string[];
};

const obligationLabels: Record<string, string> = {
  TVA: "TVA mensuelle",
  IR_SAL: "IR / Salaires",
  IS: "IS annuel",
  IR_PRO: "IR professionnel",
};

const riskThresholds: Array<{ min: number; level: DeclarationRiskLevel }> = [
  { min: 80, level: "Critical" },
  { min: 60, level: "High" },
  { min: 30, level: "Medium" },
  { min: 0, level: "Low" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function parseInputDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function daysUntil(value: string) {
  const dueDate = parseInputDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatInputDate(value: string) {
  const date = parseInputDate(value);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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

function getStatus(values: NewDeclarationFormValues): DeclarationStatus {
  if (values.missingDocuments > 0) return "Pending docs";
  if (values.checklistCompletion < 80) return "In preparation";
  if (values.checklistCompletion < 100) return "Pending review";
  return "Pending approval";
}

function getRiskLevel(score: number): DeclarationRiskLevel {
  return riskThresholds.find((threshold) => score >= threshold.min)?.level ?? "Low";
}

export function calculateLocalRisk(values: NewDeclarationFormValues): RiskCalculationResult {
  const deadlineScore = getDeadlineScore(values.dueDate);
  const documentScore = Math.min(25, values.missingDocuments * 7);
  const workflowScore =
    values.checklistCompletion < 50
      ? 20
      : values.checklistCompletion < 80
        ? 14
        : values.checklistCompletion < 100
          ? 6
          : 0;
  const consistencyScore = values.hasConsistencyAlert ? 16 : 0;
  const behaviorScore =
    values.clientBehavior === "Retard recurrent"
      ? 10
      : values.clientBehavior === "Retard leger"
        ? 5
        : 0;

  const components = [
    { label: "Pression echeance", value: deadlineScore },
    { label: "Manques documentaires", value: documentScore },
    { label: "Faiblesse workflow", value: workflowScore },
    { label: "Anomalie de coherence", value: consistencyScore },
    { label: "Comportement client", value: behaviorScore },
  ];

  const score = Math.min(
    100,
    deadlineScore + documentScore + workflowScore + consistencyScore + behaviorScore,
  );
  const rules: string[] = [];

  if (deadlineScore >= 20) {
    rules.push("Echeance proche ou depassee : dossier a traiter en priorite.");
  }

  if (values.missingDocuments > 0) {
    rules.push(`${values.missingDocuments} piece(s) obligatoire(s) restent manquantes.`);
  }

  if (values.checklistCompletion < 80) {
    rules.push("Checklist sous le seuil de controle avant revue.");
  }

  if (values.hasConsistencyAlert) {
    rules.push("Signal d'incoherence ou variation importante a justifier.");
  }

  if (values.clientBehavior !== "Normal") {
    rules.push("Comportement de transmission client a surveiller.");
  }

  return {
    score,
    level: getRiskLevel(score),
    status: getStatus(values),
    primaryDriver: components.sort((left, right) => right.value - left.value)[0].label,
    rules,
  };
}

function buildBlockers(values: NewDeclarationFormValues, risk: RiskCalculationResult) {
  const blockers: string[] = [];

  if (values.missingDocuments > 0) {
    blockers.push("Pieces justificatives obligatoires encore manquantes.");
  }

  if (values.checklistCompletion < 80) {
    blockers.push("Checklist de controle incomplete avant revue.");
  }

  if (values.hasConsistencyAlert) {
    blockers.push("Variation ou incoherence a documenter par le preparateur.");
  }

  if (risk.score >= 60) {
    blockers.push("Score de risque eleve : revue prioritaire recommandee.");
  }

  return blockers.length ? blockers : ["Aucun blocage majeur signale a la creation."];
}

function buildControls(values: NewDeclarationFormValues): LocalControlItem[] {
  const baseId = slugify(`${values.clientName}-${values.obligationCode}-${values.periodLabel}`);

  return [
    {
      id: `${baseId}-doc-pack`,
      title: "Pack documentaire confirme",
      category: "Exhaustivite documentaire",
      mandatory: true,
      status: values.missingDocuments > 0 ? "Failed" : "Completed",
      owner: values.preparer,
      note:
        values.missingDocuments > 0
          ? "Des pieces obligatoires restent a collecter avant revue."
          : "Les pieces de base sont declarees comme recues.",
    },
    {
      id: `${baseId}-amount-review`,
      title: "Montant declare revu avec les pieces",
      category: "Validation des donnees",
      mandatory: true,
      status: values.hasConsistencyAlert ? "Pending" : "Completed",
      owner: values.preparer,
      note:
        values.hasConsistencyAlert
          ? "Une justification est requise sur la variation ou l'incoherence."
          : "Aucun signal de coherence critique declare a la creation.",
    },
    {
      id: `${baseId}-reconciliation`,
      title: "Rapprochement fiscal prepare",
      category: "Rapprochement",
      mandatory: true,
      status: values.checklistCompletion >= 80 ? "Completed" : "Pending",
      owner: values.preparer,
      note: "Le dossier doit conserver une preuve du rapprochement avant approbation.",
    },
    {
      id: `${baseId}-review-gate`,
      title: "Gate de revue maker-checker",
      category: "Gate de revue",
      mandatory: true,
      status: values.checklistCompletion === 100 ? "Completed" : "Pending",
      owner: values.reviewer,
      note: "Le relecteur doit valider le dossier avant transmission superviseur.",
    },
  ];
}

function buildDocumentRequests(values: NewDeclarationFormValues): LocalDocumentRequest[] {
  if (values.missingDocuments <= 0) {
    return [];
  }

  return Array.from({ length: values.missingDocuments }).map((_, index) => ({
    id: `req-${Date.now()}-${index + 1}`,
    title: `Piece obligatoire manquante ${index + 1}`,
    dueDate: formatInputDate(values.dueDate),
    status: daysUntil(values.dueDate) <= 0 ? "En retard" : "Demandee",
    mandatory: true,
  }));
}

export function buildLocalDeclaration(
  values: NewDeclarationFormValues,
): LocalDeclarationRecord {
  const risk = calculateLocalRisk(values);
  const createdAt = new Date().toISOString();
  const clientSlug = slugify(values.clientName || "client");
  const periodSlug = slugify(values.periodLabel || "periode");

  return {
    id: `local-${clientSlug}-${values.obligationCode.toLowerCase()}-${periodSlug}-${Date.now()}`,
    clientId: `local-${clientSlug}`,
    clientName: values.clientName.trim(),
    clientType: values.clientType,
    legalForm: values.legalForm.trim(),
    city: values.city.trim(),
    obligationCode: values.obligationCode,
    obligationLabel: values.obligationLabel || obligationLabels[values.obligationCode] || values.obligationCode,
    periodLabel: values.periodLabel.trim(),
    dueDate: formatInputDate(values.dueDate),
    status: risk.status,
    riskLevel: risk.level,
    preparer: values.preparer.trim(),
    reviewer: values.reviewer.trim(),
    missingDocuments: values.missingDocuments,
    documentsReceived: values.documentsReceived,
    checklistCompletion: values.checklistCompletion,
    totalAmount: `${Number(values.totalAmount || 0).toLocaleString("fr-FR")} MAD`,
    lastUpdated: formatInputDate(createdAt.slice(0, 10)),
    blockers: buildBlockers(values, risk),
    metrics: [
      {
        label: "Montant declare",
        value: `${Number(values.totalAmount || 0).toLocaleString("fr-FR")} MAD`,
        context: "Saisi lors de la creation du dossier.",
      },
      {
        label: "Documents recus",
        value: values.documentsReceived.toString(),
        context: `${values.missingDocuments} piece(s) encore manquante(s).`,
      },
      {
        label: "Score de risque initial",
        value: risk.score.toString(),
        context: risk.primaryDriver,
      },
    ],
    activity: [
      {
        title: "Dossier cree dans le prototype",
        date: formatInputDate(createdAt.slice(0, 10)),
        detail:
          values.notes ||
          "Dossier cree par l'assistant local avec scoring de risque et controles initiaux.",
      },
    ],
    source: "local",
    createdAt,
    riskScore: risk.score,
    primaryDriver: risk.primaryDriver,
    generatedRules: risk.rules,
    generatedControls: buildControls(values),
    documentRequests: buildDocumentRequests(values),
  };
}

export function isLocalDeclarationRecord(
  declaration: DeclarationRecord | LocalDeclarationRecord,
): declaration is LocalDeclarationRecord {
  return "source" in declaration && declaration.source === "local";
}

export function readLocalDeclarations() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_DECLARATIONS_KEY);
    return raw ? (JSON.parse(raw) as LocalDeclarationRecord[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalDeclarations(declarations: LocalDeclarationRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_DECLARATIONS_KEY, JSON.stringify(declarations));
  window.dispatchEvent(new Event(LOCAL_DECLARATIONS_EVENT));
}

export function saveLocalDeclaration(declaration: LocalDeclarationRecord) {
  const existing = readLocalDeclarations();
  writeLocalDeclarations([declaration, ...existing]);
}

export function deleteLocalDeclaration(declarationId: string) {
  const next = readLocalDeclarations().filter((item) => item.id !== declarationId);
  writeLocalDeclarations(next);
  return next;
}
