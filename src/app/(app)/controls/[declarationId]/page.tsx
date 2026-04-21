import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getControlChecklistByDeclarationId,
  type ControlCategory,
  type ControlItemStatus,
} from "@/lib/mock/controls";
import type { DeclarationRiskLevel, DeclarationStatus } from "@/lib/mock/declarations";
import {
  controlCategoryLabels,
  controlStatusLabels,
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

const controlStatusStyles: Record<ControlItemStatus, string> = {
  Pending: "bg-warning-soft text-warning",
  Completed: "bg-brand-soft text-brand-strong",
  Failed: "bg-danger-soft text-danger",
  Waived: "bg-[#E7EEF7] text-[#2C6FA8]",
};

const categoryOrder: ControlCategory[] = [
  "Document completeness",
  "Data validation",
  "Reconciliation",
  "Review gate",
];

type ControlChecklistDetailPageProps = {
  params: Promise<{
    declarationId: string;
  }>;
};

export default async function ControlChecklistDetailPage({
  params,
}: ControlChecklistDetailPageProps) {
  const { declarationId } = await params;
  const checklist = getControlChecklistByDeclarationId(declarationId);

  if (!checklist) {
    notFound();
  }

  const groupedItems = categoryOrder.map((category) => ({
    category,
    items: checklist.items.filter((item) => item.category === category),
  }));

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[checklist.status]}`}
              >
                {declarationStatusLabels[checklist.status]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[checklist.riskLevel]}`}
              >
                {riskLabels[checklist.riskLevel]} risque
              </span>
              <span className="rounded-full bg-sidebar px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {checklist.completion}% completee
              </span>
            </div>

            <div>
              <p className="eyebrow text-brand">Checklist de controle</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3rem]">
                {checklist.clientName} / {checklist.obligationLabel}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                {checklist.periodLabel} / Echeance {checklist.dueDate} / Mis a jour le{" "}
                {checklist.lastUpdated}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/controls" className="secondary-button px-5 py-3 text-sm font-semibold">
                Retour aux controles
              </Link>
              <Link
                href={`/declarations/${checklist.declarationId}`}
                className="secondary-button px-5 py-3 text-sm font-semibold"
              >
                Ouvrir la declaration
              </Link>
              <Link
                href={`/approvals/${checklist.declarationId}`}
                className="secondary-button px-5 py-3 text-sm font-semibold"
              >
                Ouvrir approbation
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Preparateur",
                value: checklist.preparer,
                note: "Execution des controles",
              },
              {
                label: "Relecteur",
                value: checklist.reviewer,
                note: "Validation du package",
              },
              {
                label: "Montant declare",
                value: checklist.totalAmount,
                note: "Valeur pilotee par la checklist",
              },
              {
                label: "Gate revue",
                value: checklist.readyForReview ? "Ouverte" : "Bloquee",
                note: `${checklist.mandatoryRemaining} controles encore ouverts`,
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
          { label: "Checklist completee", value: `${checklist.completion}%` },
          {
            label: "Controles obligatoires ouverts",
            value: checklist.mandatoryRemaining.toString(),
          },
          { label: "Controles en echec", value: checklist.failedControls.toString() },
          { label: "Preuves rattachees", value: checklist.evidenceAttached.toString() },
        ].map((card) => (
          <article key={card.label} className="kpi-card rounded-[28px] p-5">
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {groupedItems.map((group) => (
            <article
              key={controlCategoryLabels[group.category]}
              className="surface-panel rounded-[32px] p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow text-muted">
                    {controlCategoryLabels[group.category]}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                    {group.items.length} points de controle
                  </h3>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {group.items.filter((item) => item.status === "Completed").length} completes
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {group.items.map((item) => (
                  <article key={item.id} className="soft-note rounded-[24px] px-5 py-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">{item.title}</p>
                          {item.mandatory ? (
                            <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-danger">
                              Obligatoire
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm leading-7 text-muted">{item.description}</p>
                        <p className="text-sm text-muted">Responsable : {item.owner}</p>
                        {item.evidenceLabel ? (
                          <p className="text-sm font-semibold text-foreground">
                            Preuve : {item.evidenceLabel}
                          </p>
                        ) : null}
                        {item.note ? <p className="text-sm text-muted">{item.note}</p> : null}
                      </div>

                      <div className="space-y-2 text-right">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${controlStatusStyles[item.status]}`}
                        >
                          {controlStatusLabels[item.status]}
                        </span>
                        {item.completedBy ? (
                          <p className="text-sm text-muted">Par {item.completedBy}</p>
                        ) : null}
                        {item.completedAt ? (
                          <p className="text-sm text-muted">{item.completedAt}</p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-6">
          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">Gate de liberation</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              {checklist.readyForReview
                ? "Checklist liberee pour revue"
                : "Checklist encore bloquee"}
            </h3>

            <div className="mt-6 space-y-4 text-sm text-muted">
              <div className="soft-note rounded-[24px] px-5 py-4">
                <p className="font-semibold text-foreground">
                  {checklist.mandatoryRemaining} controles obligatoires encore ouverts
                </p>
                <p className="mt-2 leading-7">
                  La revue ne peut pas commencer tant que chaque controle obligatoire
                  reste incomplet ou non resolu.
                </p>
              </div>
              <div className="soft-note rounded-[24px] px-5 py-4">
                <p className="font-semibold text-foreground">
                  {checklist.failedControls} controles actuellement en echec
                </p>
                <p className="mt-2 leading-7">
                  Les controles en echec representent des exceptions a corriger ou
                  justifier avant approbation.
                </p>
              </div>
              <div className="soft-note rounded-[24px] px-5 py-4">
                <p className="font-semibold text-foreground">Montant declare</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                  {checklist.totalAmount}
                </p>
              </div>
            </div>
          </article>

          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">Blocages en cours</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Pourquoi le dossier ne peut pas avancer
            </h3>

            <div className="mt-6 space-y-4">
              {checklist.blockers.map((blocker) => (
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
