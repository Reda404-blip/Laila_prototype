import { getAlerts } from "@/lib/mock/alerts";
import { getApprovalSummaries } from "@/lib/mock/approvals";
import { clients } from "@/lib/mock/clients";
import { getControlChecklistSummaries } from "@/lib/mock/controls";
import { declarations } from "@/lib/mock/declarations";
import { getClientRiskSnapshots, getDeclarationRiskSnapshots, type RiskLevel } from "@/lib/mock/risk";
import { getTasks } from "@/lib/mock/tasks";

export type ReportWorkflowMetric = {
  label: string;
  value: number;
  context: string;
};

export type ReportPortfolioRow = {
  clientId: string;
  clientName: string;
  riskLevel: RiskLevel;
  openDeclarations: number;
  openAlerts: number;
  openTasks: number;
  pendingApprovals: number;
  controlCompletion: number;
  nextDeadline: string;
};

export type ReportSnapshot = {
  generatedAt: string;
  periodLabel: string;
  totalClients: number;
  activeClients: number;
  openDeclarations: number;
  highRiskDeclarations: number;
  criticalDeclarations: number;
  openAlerts: number;
  openTasks: number;
  pendingApprovals: number;
  supervisorQueue: number;
  checklistCompletionRate: number;
  readyForReviewRate: number;
  taskLinkageRate: number;
  riskDistribution: Array<{
    level: RiskLevel;
    count: number;
  }>;
  workflowMetrics: ReportWorkflowMetric[];
  portfolioRows: ReportPortfolioRow[];
  topRiskDeclarations: ReturnType<typeof getDeclarationRiskSnapshots>;
};

export function formatRate(value: number) {
  return `${Math.round(value)}%`;
}

export function getReportSnapshot(): ReportSnapshot {
  const alerts = getAlerts();
  const tasks = getTasks();
  const approvals = getApprovalSummaries();
  const controls = getControlChecklistSummaries();
  const declarationRisks = getDeclarationRiskSnapshots();
  const clientRisks = getClientRiskSnapshots();

  const checklistCompletionRate =
    controls.reduce((sum, item) => sum + item.completion, 0) / controls.length;
  const readyForReviewRate =
    (controls.filter((item) => item.readyForReview).length / controls.length) * 100;
  const taskLinkageRate =
    (tasks.filter((task) => alerts.some((alert) => alert.id === task.sourceAlertId)).length /
      tasks.length) *
    100;

  const workflowMetrics: ReportWorkflowMetric[] = [
    {
      label: "Taux de checklist",
      value: checklistCompletionRate,
      context: `${controls.filter((item) => item.completion === 100).length} dossiers totalement complets`,
    },
    {
      label: "Prets pour revue",
      value: readyForReviewRate,
      context: `${controls.filter((item) => item.readyForReview).length} declarations liberees`,
    },
    {
      label: "Liaison des taches",
      value: taskLinkageRate,
      context: `${tasks.length} taches reliees aux alertes operationnelles`,
    },
  ];

  const portfolioRows: ReportPortfolioRow[] = clientRisks.map((clientRisk) => {
    const clientApprovals = approvals.filter(
      (item) =>
        item.clientName === clientRisk.clientName && item.currentDecision === "Pending",
    );
    const clientControls = controls.filter((item) => item.clientName === clientRisk.clientName);
    const controlCompletion =
      clientControls.reduce((sum, item) => sum + item.completion, 0) / clientControls.length;

    return {
      clientId: clientRisk.clientId,
      clientName: clientRisk.clientName,
      riskLevel: clientRisk.riskLevel,
      openDeclarations: clientRisk.openDeclarations,
      openAlerts: alerts.filter((item) => item.clientName === clientRisk.clientName).length,
      openTasks: tasks.filter((item) => item.clientName === clientRisk.clientName).length,
      pendingApprovals: clientApprovals.length,
      controlCompletion,
      nextDeadline: clientRisk.nextDeadline,
    };
  });

  return {
    generatedAt: "19/04/2026 09:30",
    periodLabel: "Snapshot operationnel avril 2026",
    totalClients: clients.length,
    activeClients: clients.filter((item) => item.status === "Active").length,
    openDeclarations: declarations.length,
    highRiskDeclarations: declarationRisks.filter((item) => item.totalScore >= 60).length,
    criticalDeclarations: declarationRisks.filter((item) => item.riskLevel === "Critical").length,
    openAlerts: alerts.filter((item) => item.status === "Open").length,
    openTasks: tasks.filter((item) => item.status === "Open").length,
    pendingApprovals: approvals.filter((item) => item.currentDecision === "Pending").length,
    supervisorQueue: approvals.filter(
      (item) => item.currentStage === "Supervisor" && item.currentDecision === "Pending",
    ).length,
    checklistCompletionRate,
    readyForReviewRate,
    taskLinkageRate,
    riskDistribution: (["Low", "Medium", "High", "Critical"] as RiskLevel[]).map((level) => ({
      level,
      count: declarationRisks.filter((item) => item.riskLevel === level).length,
    })),
    workflowMetrics,
    portfolioRows,
    topRiskDeclarations: declarationRisks,
  };
}

