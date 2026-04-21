import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getApprovalDetailByDeclarationId,
  type ApprovalDecision,
  type ApprovalGateStatus,
  type ApprovalStage,
} from "@/lib/mock/approvals";
import type { DeclarationRiskLevel, DeclarationStatus } from "@/lib/mock/declarations";
import {
  approvalDecisionLabels,
  approvalGateLabels,
  declarationStatusLabels,
  riskLabels,
} from "@/lib/i18n/fr";

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
  Reviewer: "Etape relecteur",
  Supervisor: "Etape superviseur",
};

type ApprovalDetailPageProps = {
  params: Promise<{
    declarationId: string;
  }>;
};

export default async function ApprovalDetailPage({ params }: ApprovalDetailPageProps) {
  const { declarationId } = await params;
  const approval = getApprovalDetailByDeclarationId(declarationId);

  if (!approval) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[approval.declarationStatus]}`}
              >
                {declarationStatusLabels[approval.declarationStatus]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${decisionStyles[approval.currentDecision]}`}
              >
                {approvalDecisionLabels[approval.currentDecision]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${gateStyles[approval.gateStatus]}`}
              >
                {approvalGateLabels[approval.gateStatus]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[approval.riskLevel]}`}
              >
                {riskLabels[approval.riskLevel]} risque
              </span>
            </div>

            <div>
              <p className="eyebrow text-brand">Dossier approbation</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3rem]">
                {approval.clientName} / {approval.obligationLabel}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                {approval.periodLabel} / Echeance {approval.dueDate} / Gate actuelle{" "}
                {stageLabels[approval.currentStage]}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/approvals" className="secondary-button px-5 py-3 text-sm font-semibold">
                Retour aux approbations
              </Link>
              <Link
                href={`/controls/${approval.declarationId}`}
                className="secondary-button px-5 py-3 text-sm font-semibold"
              >
                Ouvrir la checklist
              </Link>
              <Link
                href={`/declarations/${approval.declarationId}`}
                className="secondary-button px-5 py-3 text-sm font-semibold"
              >
                Ouvrir la declaration
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Preparateur",
                value: approval.preparer,
                note: "Production du dossier",
              },
              {
                label: "Relecteur",
                value: approval.reviewer,
                note: "Decision de revue",
              },
              {
                label: "Acteur courant",
                value: approval.nextActor,
                note: "Prochaine decision attendue",
              },
              {
                label: "Montant declare",
                value: approval.totalAmount,
                note: `${approval.historyCount} evenements deja traces`,
              },
            ].map((item) => (
              <article key={item.label} className="auth-tile rounded-[24px] p-5">
                <p className="eyebrow text-muted">{item.label}</p>
                <p className="mt-3 font-heading text-2xl font-semibold text-foreground">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Montant declare", value: approval.totalAmount },
          {
            label: "Controles obligatoires ouverts",
            value: approval.mandatoryRemaining.toString(),
          },
          { label: "Controles en echec", value: approval.failedControls.toString() },
          { label: "Evenements approbation", value: approval.historyCount.toString() },
        ].map((card) => (
          <article key={card.label} className="kpi-card rounded-[28px] p-5">
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-panel rounded-[32px] p-6">
          <p className="eyebrow text-muted">Chronologie approbation</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Decisions du relecteur et du superviseur
          </h3>

          <div className="mt-6 space-y-4">
            {approval.timeline.map((event) => (
              <article key={event.id} className="soft-note rounded-[24px] px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{stageLabels[event.stage]}</p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${decisionStyles[event.status]}`}
                      >
                        {approvalDecisionLabels[event.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">Acteur : {event.actor}</p>
                    <p className="mt-3 text-sm leading-7 text-muted">{event.note}</p>
                  </div>

                  <div className="space-y-2 text-right text-sm text-muted">
                    <p>Demande le {event.requestedAt}</p>
                    {event.decidedAt ? <p>Decide le {event.decidedAt}</p> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">Gate approbation</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              {approval.readyForReview
                ? "Dossier de controle pret pour revue"
                : "Dossier de controle encore bloque"}
            </h3>

            <div className="mt-6 space-y-4 text-sm text-muted">
              <div className="soft-note rounded-[24px] px-5 py-4">
                <p className="font-semibold text-foreground">Acteur courant</p>
                <p className="mt-2">{approval.nextActor}</p>
              </div>
              <div className="soft-note rounded-[24px] px-5 py-4">
                <p className="font-semibold text-foreground">
                  {approval.mandatoryRemaining} controles obligatoires ouverts
                </p>
                <p className="mt-2 leading-7">
                  Lapprobation ne doit pas avancer tant que les controles obligatoires
                  restent non resolus.
                </p>
              </div>
              <div className="soft-note rounded-[24px] px-5 py-4">
                <p className="font-semibold text-foreground">
                  {approval.failedControls} controles en echec
                </p>
                <p className="mt-2 leading-7">
                  Les dossiers retournes ou bloques doivent renvoyer a des exceptions
                  explicites issues de la checklist.
                </p>
              </div>
            </div>
          </article>

          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">Blocages en cours</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Raisons qui bloquent la progression
            </h3>

            <div className="mt-6 space-y-4">
              {approval.blockers.map((blocker) => (
                <article
                  key={blocker}
                  className="rounded-[24px] border border-border bg-danger-soft px-5 py-4 text-sm leading-7 text-danger"
                >
                  {blocker}
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
