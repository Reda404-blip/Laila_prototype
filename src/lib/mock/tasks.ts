import { getAlerts } from "@/lib/mock/alerts";

export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus = "Open" | "In progress" | "Blocked" | "Done";
export type TaskType =
  | "Document follow-up"
  | "Control remediation"
  | "Reviewer action"
  | "Supervisor approval";

export type TaskRecord = {
  id: string;
  declarationId: string;
  clientName: string;
  obligationLabel: string;
  periodLabel: string;
  title: string;
  taskType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  sourceAlertId: string;
  note: string;
};

const tasks: TaskRecord[] = [
  {
    id: "task-atlas-docs",
    declarationId: "decl-atlas-tva-2026-03",
    clientName: "Atlas Agro",
    obligationLabel: "TVA mensuelle",
    periodLabel: "Mars 2026",
    title: "Collecter les factures d'achat manquantes",
    taskType: "Document follow-up",
    priority: "Critical",
    status: "Open",
    assignee: "Nadia Tazi",
    dueDate: "20/04/2026",
    sourceAlertId: "alert-control-1",
    note: "Deux factures fournisseurs restent manquantes et bloquent la revue.",
  },
  {
    id: "task-atlas-reco",
    declarationId: "decl-atlas-tva-2026-03",
    clientName: "Atlas Agro",
    obligationLabel: "TVA mensuelle",
    periodLabel: "Mars 2026",
    title: "Resoudre l'ecart de TVA collectee",
    taskType: "Control remediation",
    priority: "High",
    status: "Blocked",
    assignee: "Nadia Tazi",
    dueDate: "20/04/2026",
    sourceAlertId: "alert-risk-1",
    note: "L'extrait comptable manque encore dans le dossier client.",
  },
  {
    id: "task-rif-cnss",
    declarationId: "decl-rif-irsal-2026-03",
    clientName: "Rif Digital",
    obligationLabel: "IR / Salaires",
    periodLabel: "Mars 2026",
    title: "Demander le justificatif CNSS au client",
    taskType: "Document follow-up",
    priority: "High",
    status: "Open",
    assignee: "Ayoub Chraibi",
    dueDate: "22/04/2026",
    sourceAlertId: "alert-control-2",
    note: "La gate de revue reste bloquee tant que le justificatif CNSS n'est pas charge.",
  },
  {
    id: "task-sahara-note",
    declarationId: "decl-sahara-is-2025",
    clientName: "Sahara Retail",
    obligationLabel: "IS annuel",
    periodLabel: "Exercice 2025",
    title: "Preparer la note de variation pour le relecteur",
    taskType: "Reviewer action",
    priority: "High",
    status: "In progress",
    assignee: "Nadia Tazi",
    dueDate: "21/04/2026",
    sourceAlertId: "alert-approval-3",
    note: "Le relecteur a retourne le dossier en attente d'une explication sur les provisions et charges exceptionnelles.",
  },
  {
    id: "task-oasis-supervisor",
    declarationId: "decl-oasis-tva-2026-03",
    clientName: "Oasis Transit",
    obligationLabel: "TVA mensuelle",
    periodLabel: "Mars 2026",
    title: "Validation superviseur avant depot",
    taskType: "Supervisor approval",
    priority: "Medium",
    status: "Open",
    assignee: "Sara El Idrissi",
    dueDate: "20/04/2026",
    sourceAlertId: "alert-approval-4",
    note: "La checklist et la validation du relecteur sont completes. La validation finale reste en attente.",
  },
];

export function getTasks() {
  return tasks;
}

export function getTasksByDeclarationId(declarationId: string) {
  return tasks.filter((task) => task.declarationId === declarationId);
}

export function getTaskSummary() {
  const linkedAlerts = new Set(getAlerts().map((item) => item.id));

  return {
    total: tasks.length,
    open: tasks.filter((item) => item.status === "Open").length,
    blocked: tasks.filter((item) => item.status === "Blocked").length,
    linkedAlerts: tasks.filter((item) => linkedAlerts.has(item.sourceAlertId)).length,
  };
}

