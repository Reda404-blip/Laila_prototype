import type { AlertSeverity, AlertSource, AlertStatus } from "@/lib/mock/alerts";
import type {
  ApprovalDecision,
  ApprovalGateStatus,
  ApprovalStage,
} from "@/lib/mock/approvals";
import type { ClientRiskLevel, ClientStatus } from "@/lib/mock/clients";
import type { ControlCategory, ControlItemStatus } from "@/lib/mock/controls";
import type { DeclarationRiskLevel, DeclarationStatus } from "@/lib/mock/declarations";
import type { DocumentRequestStatus, DocumentStatus } from "@/lib/mock/documents";
import type { RiskLevel } from "@/lib/mock/risk";
import type { TaskPriority, TaskStatus, TaskType } from "@/lib/mock/tasks";

export const riskLabels: Record<
  RiskLevel | DeclarationRiskLevel | ClientRiskLevel,
  string
> = {
  Low: "Faible",
  Medium: "Moyen",
  High: "Eleve",
  Critical: "Critique",
};

export const clientStatusLabels: Record<ClientStatus, string> = {
  Active: "Actif",
  Onboarding: "Onboarding",
  Watchlist: "Sous surveillance",
};

export const declarationStatusLabels: Record<DeclarationStatus, string> = {
  "Pending docs": "Docs manquants",
  "In preparation": "En preparation",
  "Pending review": "En revue",
  "Pending approval": "En approbation",
  Approved: "Approuvee",
};

export const documentStatusLabels: Record<DocumentStatus, string> = {
  Uploaded: "Televerse",
  Verified: "Verifie",
  Rejected: "Rejete",
};

export const documentRequestStatusLabels: Record<DocumentRequestStatus, string> = {
  Requested: "Demandee",
  Received: "Recue",
  Verified: "Verifiee",
  Overdue: "En retard",
};

export const controlStatusLabels: Record<ControlItemStatus, string> = {
  Pending: "En attente",
  Completed: "Complete",
  Failed: "Echec",
  Waived: "Derogation",
};

export const controlCategoryLabels: Record<ControlCategory, string> = {
  "Document completeness": "Exhaustivite documentaire",
  "Data validation": "Validation des donnees",
  Reconciliation: "Rapprochement",
  "Review gate": "Gate de revue",
};

export const approvalStageLabels: Record<ApprovalStage, string> = {
  Reviewer: "Relecteur",
  Supervisor: "Superviseur",
};

export const approvalDecisionLabels: Record<ApprovalDecision, string> = {
  Pending: "En attente",
  Approved: "Approuve",
  Returned: "Retourne",
};

export const approvalGateLabels: Record<ApprovalGateStatus, string> = {
  Blocked: "Bloque",
  "In review": "En revue",
  "Awaiting approval": "En approbation",
  Closed: "Cloture",
};

export const alertSeverityLabels: Record<AlertSeverity, string> = {
  Info: "Info",
  Warning: "Alerte",
  High: "Eleve",
  Critical: "Critique",
};

export const alertStatusLabels: Record<AlertStatus, string> = {
  Open: "Ouverte",
  Acknowledged: "Prise en charge",
  Resolved: "Resolue",
};

export const alertSourceLabels: Record<AlertSource, string> = {
  Risk: "Risque",
  Controls: "Controles",
  Approvals: "Approbations",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  Low: "Faible",
  Medium: "Moyenne",
  High: "Elevee",
  Critical: "Critique",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  Open: "Ouverte",
  "In progress": "En cours",
  Blocked: "Bloquee",
  Done: "Terminee",
};

export const taskTypeLabels: Record<TaskType, string> = {
  "Document follow-up": "Relance documentaire",
  "Control remediation": "Remediation de controle",
  "Reviewer action": "Action du relecteur",
  "Supervisor approval": "Approbation superviseur",
};
