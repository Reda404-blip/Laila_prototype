import Link from "next/link";

import { declarationStatusLabels, riskLabels } from '@/lib/i18n/fr';

import {
  declarations,
  type DeclarationRiskLevel,
  type DeclarationStatus,
} from "@/lib/mock/declarations";

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

export default function DeclarationsPage() {
  const summary = {
    total: declarations.length,
    urgent: declarations.filter(
      (item) => item.riskLevel === "High" || item.riskLevel === "Critical",
    ).length,
    blocked: declarations.filter((item) => item.status === "Pending docs").length,
    approval: declarations.filter((item) => item.status === "Pending approval")
      .length,
  };

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-brand">
            Operations declaratives
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Workflow declaratif priorise par le risque et le statut de controle.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Ce module transforme les obligations recurrentes en dossiers operationnels avec
            echeances, responsables, blocages et statut d&apos;avancement.
          </p>
        </div>

        <button
          type="button"
          className="primary-button h-12 px-5 text-sm font-semibold"
        >
          Creer une declaration
        </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Declarations ouvertes", value: summary.total.toString().padStart(2, "0") },
          { label: "Dossiers prioritaires", value: summary.urgent.toString().padStart(2, "0") },
          { label: "Bloques sur documents", value: summary.blocked.toString().padStart(2, "0") },
          { label: "En attente d'approbation", value: summary.approval.toString().padStart(2, "0") },
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
              File des declarations
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Perimetre declaratif par periode et urgence
            </h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder="Rechercher client, obligation, periode..."
              className="app-input"
            />
            <div className="flex gap-2">
              {["Tous", "Urgent", "En revue", "En approbation"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    filter === "Tous"
                      ? "bg-foreground text-white shadow-[0_10px_20px_rgba(18,26,34,0.12)]"
                      : "bg-surface text-muted"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-shell mt-6">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Client / dossier</th>
                <th className="px-4 py-3 font-semibold">Responsable</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Risque</th>
                <th className="px-4 py-3 font-semibold">Echeance</th>
                <th className="px-4 py-3 font-semibold">Checklist</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {declarations.map((declaration) => (
                <tr key={declaration.id} className="align-top hover:bg-background/60">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">
                      {declaration.clientName}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                      {declaration.obligationLabel} • {declaration.periodLabel}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {declaration.missingDocuments} docs manquants •{" "}
                      {declaration.totalAmount}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p>{declaration.preparer}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em]">
                      Relecteur : {declaration.reviewer}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[declaration.status]}`}
                    >
                      {declarationStatusLabels[declaration.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[declaration.riskLevel]}`}
                    >
                      {riskLabels[declaration.riskLevel]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted">{declaration.dueDate}</td>
                  <td className="px-4 py-4 text-muted">
                    {declaration.checklistCompletion}%
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/declarations/${declaration.id}`}
                      className="inline-flex rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
                    >
                      Ouvrir le dossier
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



