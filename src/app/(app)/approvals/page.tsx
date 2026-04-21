import Link from "next/link";

import { approvalDecisionLabels, approvalGateLabels, declarationStatusLabels, riskLabels } from '@/lib/i18n/fr';

import {
  getApprovalDashboardSummary,
  getApprovalSummaries,
  type ApprovalDecision,
  type ApprovalGateStatus,
  type ApprovalStage,
} from "@/lib/mock/approvals";
import type { DeclarationRiskLevel, DeclarationStatus } from "@/lib/mock/declarations";

const riskStyles: Record<DeclarationRiskLevel, string> = {
  Low: "bg-brand-soft text-brand-strong",
  Medium: "bg-warning-soft text-warning",
  High: "bg-[#F8E1D0] text-[#C96A1A]",
  Critical: "bg-danger-soft text-danger",
};

const statusStyles: Record<DeclarationStatus, string> = {
  "Pending docs": "bg-danger-soft text-danger",
  "In preparation": "bg-[#E7EEF7] text-[#2C6FA8]",
  "Pending review": "bg-warning-soft text-warning",
  "Pending approval": "bg-brand-soft text-brand-strong",
  Approved: "bg-[#E5F3EA] text-[#2F7D5A]",
};

const decisionStyles: Record<ApprovalDecision, string> = {
  Pending: "bg-warning-soft text-warning",
  Approved: "bg-brand-soft text-brand-strong",
  Returned: "bg-danger-soft text-danger",
};

const gateStyles: Record<ApprovalGateStatus, string> = {
  Blocked: "bg-danger-soft text-danger",
  "In review": "bg-warning-soft text-warning",
  "Awaiting approval": "bg-brand-soft text-brand-strong",
  Closed: "bg-[#E5F3EA] text-[#2F7D5A]",
};

const stageLabels: Record<ApprovalStage, string> = {
  Reviewer: "Gate relecteur",
  Supervisor: "Gate superviseur",
};

export default function ApprovalsPage() {
  const approvals = getApprovalSummaries();
  const summary = getApprovalDashboardSummary();

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-brand">
            Workflow d&apos;approbation
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Les gates maker-checker et superviseur sont suivis par declaration.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Cette file montre quels dossiers sont bloques avant revue, lesquels ont ete retournes,
            et lesquels attendent la validation finale.
          </p>
        </div>

        <div className="soft-note rounded-[26px] px-5 py-4">
          <p className="text-sm text-muted">Logique approbation</p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            Les etapes relecteur et superviseur restent separees pour demontrer
            un controle maker-checker formel.
          </p>
        </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Dossiers dans le workflow", value: summary.total.toString().padStart(2, "0") },
          { label: "Decisions en attente", value: summary.pending.toString().padStart(2, "0") },
          { label: "Retournes par le relecteur", value: summary.returned.toString().padStart(2, "0") },
          { label: "File superviseur", value: summary.supervisorQueue.toString().padStart(2, "0") },
        ].map((card) => (
          <article
            key={card.label}
            className="kpi-card rounded-[28px] p-5"
          >
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="table-panel p-6">
        <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              File des approbations
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Statut de validation formelle par dossier
            </h3>
          </div>

          <div className="soft-note rounded-[22px] px-4 py-3 text-sm text-muted">
            La revue ne peut pas commencer tant que les controles obligatoires ne sont pas leves.
          </div>
        </div>

        <div className="table-shell mt-6">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Declaration</th>
                <th className="px-4 py-3 font-semibold">Gate actuelle</th>
                <th className="px-4 py-3 font-semibold">Etat de preparation</th>
                <th className="px-4 py-3 font-semibold">Acteur suivant</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {approvals.map((approval) => (
                <tr key={approval.declarationId} className="align-top hover:bg-background/60">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{approval.clientName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                      {approval.obligationLabel} / {approval.periodLabel}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[approval.declarationStatus]}`}
                      >
                        {declarationStatusLabels[approval.declarationStatus]}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[approval.riskLevel]}`}
                      >
                        {riskLabels[approval.riskLevel]} risque
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">
                      {stageLabels[approval.currentStage]}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${decisionStyles[approval.currentDecision]}`}
                      >
                        {approvalDecisionLabels[approval.currentDecision]}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${gateStyles[approval.gateStatus]}`}
                      >
                        {approvalGateLabels[approval.gateStatus]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p>{approval.mandatoryRemaining} controles obligatoires ouverts</p>
                    <p className="mt-2">{approval.failedControls} controles en echec</p>
                    <p className="mt-2 font-semibold text-foreground">
                      {approval.readyForReview ? "Liberation de revue possible" : "Liberation bloquee"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p className="font-semibold text-foreground">{approval.nextActor}</p>
                    <p className="mt-2">Echeance {approval.dueDate}</p>
                    <p className="mt-2">{approval.historyCount} evenements d&apos;approbation enregistres</p>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/approvals/${approval.declarationId}`}
                      className="secondary-button px-4 py-2 text-sm font-semibold"
                    >
                      Ouvrir l&apos;approbation
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


