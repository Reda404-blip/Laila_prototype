import {
  getControlChecklistByDeclarationId,
  getControlChecklistSummaries,
} from "@/lib/mock/controls";
import {
  declarations,
  getDeclarationById,
  type DeclarationRiskLevel,
  type DeclarationStatus,
} from "@/lib/mock/declarations";

export type ApprovalStage = "Reviewer" | "Supervisor";
export type ApprovalDecision = "Pending" | "Approved" | "Returned";
export type ApprovalGateStatus = "Blocked" | "In review" | "Awaiting approval" | "Closed";

export type ApprovalEvent = {
  id: string;
  declarationId: string;
  stage: ApprovalStage;
  actor: string;
  status: ApprovalDecision;
  requestedAt: string;
  decidedAt?: string;
  note: string;
};

export type ApprovalSummary = {
  declarationId: string;
  clientName: string;
  obligationLabel: string;
  periodLabel: string;
  dueDate: string;
  declarationStatus: DeclarationStatus;
  riskLevel: DeclarationRiskLevel;
  currentStage: ApprovalStage;
  currentDecision: ApprovalDecision;
  gateStatus: ApprovalGateStatus;
  nextActor: string;
  readyForReview: boolean;
  failedControls: number;
  mandatoryRemaining: number;
  historyCount: number;
};

export type ApprovalDetail = ApprovalSummary & {
  preparer: string;
  reviewer: string;
  totalAmount: string;
  blockers: string[];
  timeline: ApprovalEvent[];
};

const approvalEvents: ApprovalEvent[] = [
  {
    id: "appr-atlas-review-1",
    declarationId: "decl-atlas-tva-2026-03",
    stage: "Reviewer",
    actor: "Youssef Bennani",
    status: "Pending",
    requestedAt: "18/04/2026 11:15",
    note: "La gate de revue ne peut pas commencer tant que les factures manquantes et les preuves de rapprochement ne sont pas resolues.",
  },
  {
    id: "appr-rif-review-1",
    declarationId: "decl-rif-irsal-2026-03",
    stage: "Reviewer",
    actor: "Youssef Bennani",
    status: "Pending",
    requestedAt: "18/04/2026 11:40",
    note: "Le dossier paie reste en preparation en attente du justificatif CNSS.",
  },
  {
    id: "appr-sahara-review-1",
    declarationId: "decl-sahara-is-2025",
    stage: "Reviewer",
    actor: "Sara El Idrissi",
    status: "Returned",
    requestedAt: "17/04/2026 09:20",
    decidedAt: "17/04/2026 14:00",
    note: "Fournir une note justificative sur les provisions et charges exceptionnelles avant poursuite de lapprobation.",
  },
  {
    id: "appr-oasis-review-1",
    declarationId: "decl-oasis-tva-2026-03",
    stage: "Reviewer",
    actor: "Youssef Bennani",
    status: "Approved",
    requestedAt: "18/04/2026 09:50",
    decidedAt: "18/04/2026 10:15",
    note: "Les controles obligatoires et rapprochements sont valides. Le dossier est libere pour le superviseur.",
  },
  {
    id: "appr-oasis-supervisor-1",
    declarationId: "decl-oasis-tva-2026-03",
    stage: "Supervisor",
    actor: "Sara El Idrissi",
    status: "Pending",
    requestedAt: "18/04/2026 10:20",
    note: "La validation superviseur constitue la gate finale avant depot.",
  },
];

const stagePriority: Record<ApprovalStage, number> = {
  Reviewer: 0,
  Supervisor: 1,
};

const decisionPriority: Record<ApprovalDecision, number> = {
  Pending: 0,
  Returned: 1,
  Approved: 2,
};

function getTimelineForDeclaration(declarationId: string) {
  return approvalEvents.filter((event) => event.declarationId === declarationId);
}

function buildApprovalSummary(declarationId: string): ApprovalSummary | undefined {
  const declaration = getDeclarationById(declarationId);
  const checklist = getControlChecklistByDeclarationId(declarationId);

  if (!declaration || !checklist) {
    return undefined;
  }

  const timeline = getTimelineForDeclaration(declarationId).sort((left, right) => {
    const leftPriority = stagePriority[left.stage];
    const rightPriority = stagePriority[right.stage];

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return decisionPriority[left.status] - decisionPriority[right.status];
  });

  const currentEvent =
    timeline.find((event) => event.status === "Pending") ?? timeline[timeline.length - 1];

  const gateStatus: ApprovalGateStatus = !checklist.readyForReview
    ? "Blocked"
    : currentEvent?.stage === "Supervisor" && currentEvent.status === "Pending"
      ? "Awaiting approval"
      : currentEvent?.status === "Pending"
        ? "In review"
        : declaration.status === "Approved"
          ? "Closed"
          : "In review";

  return {
    declarationId,
    clientName: declaration.clientName,
    obligationLabel: declaration.obligationLabel,
    periodLabel: declaration.periodLabel,
    dueDate: declaration.dueDate,
    declarationStatus: declaration.status,
    riskLevel: declaration.riskLevel,
    currentStage: currentEvent?.stage ?? "Reviewer",
    currentDecision: currentEvent?.status ?? "Pending",
    gateStatus,
    nextActor: currentEvent?.actor ?? declaration.reviewer,
    readyForReview: checklist.readyForReview,
    failedControls: checklist.failedControls,
    mandatoryRemaining: checklist.mandatoryRemaining,
    historyCount: timeline.length,
  };
}

export function getApprovalSummaries() {
  return getControlChecklistSummaries()
    .map((item) => buildApprovalSummary(item.declarationId))
    .filter((item): item is ApprovalSummary => Boolean(item))
    .sort((left, right) => {
      const leftRank = decisionPriority[left.currentDecision];
      const rightRank = decisionPriority[right.currentDecision];

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return left.failedControls - right.failedControls;
    });
}

export function getApprovalDetailByDeclarationId(
  declarationId: string,
): ApprovalDetail | undefined {
  const declaration = getDeclarationById(declarationId);
  const summary = buildApprovalSummary(declarationId);

  if (!declaration || !summary) {
    return undefined;
  }

  return {
    ...summary,
    preparer: declaration.preparer,
    reviewer: declaration.reviewer,
    totalAmount: declaration.totalAmount,
    blockers: declaration.blockers,
    timeline: getTimelineForDeclaration(declarationId),
  };
}

export function getApprovalDashboardSummary() {
  const approvals = getApprovalSummaries();

  return {
    total: approvals.length,
    pending: approvals.filter((item) => item.currentDecision === "Pending").length,
    returned: approvals.filter((item) => item.currentDecision === "Returned").length,
    supervisorQueue: approvals.filter(
      (item) => item.currentStage === "Supervisor" && item.currentDecision === "Pending",
    ).length,
  };
}

export const approvalDeclarations = declarations.map((item) => item.id);
