import Link from "next/link";

import { declarationStatusLabels, riskLabels } from '@/lib/i18n/fr';

import {
  getControlChecklistSummaries,
  type ControlChecklistSummary,
} from "@/lib/mock/controls";
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

function getQueueSummary(items: ControlChecklistSummary[]) {
  return {
    total: items.length,
    blocked: items.filter((item) => item.failedControls > 0 || item.mandatoryRemaining > 0)
      .length,
    ready: items.filter((item) => item.readyForReview).length,
    avgAvancement: Math.round(
      items.reduce((sum, item) => sum + item.completion, 0) / items.length,
    ),
  };
}

export default function ControlsPage() {
  const checklists = getControlChecklistSummaries();
  const summary = getQueueSummary(checklists);

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-brand">
            Activites de controle
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Les controles obligatoires doivent etre executes avant que le dossier avance.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Cette file montre quelles declarations sont bloquees, quels controles ont echoue, et
            quels dossiers sont prets pour la revue.
          </p>
        </div>

        <div className="soft-note rounded-[26px] px-5 py-4">
          <p className="text-sm text-muted">Logique de controle</p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            Les points obligatoires, preuves attendues et gates de revue sont
            suivis declaration par declaration.
          </p>
        </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Checklists actives", value: summary.total.toString().padStart(2, "0") },
          { label: "Dossiers bloques", value: summary.blocked.toString().padStart(2, "0") },
          { label: "Prets pour revue", value: summary.ready.toString().padStart(2, "0") },
          { label: "Avancement moyen", value: `${summary.avgAvancement}%` },
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
              File des checklists
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Dossiers classes par pression de controle
            </h3>
          </div>

          <div className="soft-note rounded-[22px] px-4 py-3 text-sm text-muted">
            Le dossier est pret pour revue seulement si aucun controle obligatoire reste en attente ou en echec.
          </div>
        </div>

        <div className="table-shell mt-6">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Declaration</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Avancement</th>
                <th className="px-4 py-3 font-semibold">Ecarts de controle</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {checklists.map((checklist) => (
                <tr key={checklist.declarationId} className="align-top hover:bg-background/60">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{checklist.clientName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                      {checklist.obligationLabel} / {checklist.periodLabel}
                    </p>
                    <p className="mt-2 text-sm text-muted">Echeance {checklist.dueDate}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[checklist.status]}`}
                      >
                        {declarationStatusLabels[checklist.status]}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[checklist.riskLevel]}`}
                      >
                        {riskLabels[checklist.riskLevel]} risque
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-heading text-3xl font-semibold text-foreground">
                      {checklist.completion}%
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {checklist.evidenceAttached} preuves rattachees
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p>{checklist.mandatoryRemaining} obligatoires encore ouverts</p>
                    <p className="mt-2">{checklist.failedControls} controles en echec</p>
                    <p className="mt-2 font-semibold text-foreground">
                      {checklist.readyForReview ? "Gate de revue ouverte" : "Gate de revue bloquee"}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/controls/${checklist.declarationId}`}
                      className="secondary-button px-4 py-2 text-sm font-semibold"
                    >
                      Ouvrir la checklist
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


