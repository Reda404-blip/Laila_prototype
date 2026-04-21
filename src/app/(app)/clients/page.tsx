import Link from "next/link";

import { clientStatusLabels, riskLabels } from "@/lib/i18n/fr";
import { clients, type ClientRiskLevel, type ClientStatus } from "@/lib/mock/clients";

const riskStyles: Record<ClientRiskLevel, string> = {
  Low: "bg-brand-soft text-brand-strong",
  Medium: "bg-warning-soft text-warning",
  High: "bg-[#F8E1D0] text-[#C96A1A]",
  Critical: "bg-danger-soft text-danger",
};

const statusStyles: Record<ClientStatus, string> = {
  Active: "bg-brand-soft text-brand-strong",
  Onboarding: "bg-[#E7EEF7] text-[#2C6FA8]",
  Watchlist: "bg-warning-soft text-warning",
};

function parseDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export default function ClientsPage() {
  const monthEndCutoff = parseDate("30/04/2026");

  const summary = {
    total: clients.length,
    highRisk: clients.filter(
      (client) => client.riskLevel === "High" || client.riskLevel === "Critical",
    ).length,
    missingDocuments: clients.reduce(
      (total, client) => total + client.missingDocuments,
      0,
    ),
    dueSoon: clients.filter(
      (client) => parseDate(client.nextDeadline) <= monthEndCutoff,
    ).length,
  };

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="space-y-4">
            <p className="eyebrow text-brand">
            Portefeuille
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3.05rem]">
              Portefeuille clients avec contexte risque, priorite et supervision.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Le module clients centralise le pilotage du cabinet : responsables,
              obligations, exposition au risque et suivi operationnel.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                className="primary-button h-12 px-5 text-sm font-semibold"
              >
                Ajouter un client
              </button>
              <button
                type="button"
                className="secondary-button h-12 px-5 text-sm font-semibold"
              >
                Export portefeuille
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Portefeuille actif",
                value: `${summary.total.toString().padStart(2, "0")} clients`,
                note: "Vision globale du cabinet",
              },
              {
                label: "Sous pression",
                value: `${summary.highRisk.toString().padStart(2, "0")} sensibles`,
                note: "Clients a traiter en priorite",
              },
              {
                label: "Pieces a relancer",
                value: `${summary.missingDocuments.toString().padStart(2, "0")} manquantes`,
                note: "Suivi documentaire structure",
              },
              {
                label: "Echeances proches",
                value: `${summary.dueSoon.toString().padStart(2, "0")} ce mois`,
                note: "Charge de fin de cycle",
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
          { label: "Clients du portefeuille", value: summary.total.toString().padStart(2, "0") },
          { label: "Clients a risque eleve", value: summary.highRisk.toString().padStart(2, "0") },
          {
            label: "Documents manquants",
            value: summary.missingDocuments.toString().padStart(2, "0"),
          },
          { label: "Echeance avant fin de mois", value: summary.dueSoon.toString().padStart(2, "0") },
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
            <p className="eyebrow text-muted">
              Liste des clients
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Vue portefeuille du cabinet
            </h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder="Rechercher un client, un code, une ville..."
              className="app-input"
            />
            <div className="flex gap-2">
              {["Tous", "Risque eleve", "PME", "TPE"].map((filter) => (
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
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Responsable</th>
                <th className="px-4 py-3 font-semibold">Risque</th>
                <th className="px-4 py-3 font-semibold">Prochaine echeance</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {clients.map((client) => (
                <tr key={client.id} className="align-top hover:bg-background/60">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{client.tradeName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                      {client.code} • {client.city}
                    </p>
                    <p className="mt-2 text-sm text-muted">{client.legalName}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p>{client.clientType}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em]">
                      {client.legalForm}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted">
                    <p>{client.accountManager}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em]">
                      Relecteur : {client.reviewer}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[client.riskLevel]}`}
                    >
                      {riskLabels[client.riskLevel]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted">{client.nextDeadline}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[client.status]}`}
                    >
                      {clientStatusLabels[client.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/clients/${client.id}`}
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

