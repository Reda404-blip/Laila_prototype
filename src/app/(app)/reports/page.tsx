import Link from "next/link";

import { riskLabels } from '@/lib/i18n/fr';
import { formatRate, getReportSnapshot } from '@/lib/mock/reports';
import type { RiskLevel } from "@/lib/mock/risk";

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-brand-soft text-brand-strong",
  Medium: "bg-warning-soft text-warning",
  High: "bg-[#F8E1D0] text-[#C96A1A]",
  Critical: "bg-danger-soft text-danger",
};

export default function RapportsPage() {
  const report = getReportSnapshot();

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-brand">
            Rapports
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Indicateurs de pilotage construits a partir du workflow du prototype.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Cette vue transforme les donnees operationnelles en indicateurs de supervision pour l&apos;associe du cabinet,
            le relecteur et la presentation PFE.
          </p>
        </div>

        <div className="soft-note rounded-[26px] px-5 py-4">
          <p className="text-sm text-muted">Snapshot genere</p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            {report.periodLabel} / {report.generatedAt}
          </p>
        </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Clients actifs", value: report.activeClients.toString().padStart(2, "0") },
          {
            label: "Declarations a risque eleve",
            value: report.highRiskDeclarations.toString().padStart(2, "0"),
          },
          { label: "Alertes ouvertes", value: report.openAlerts.toString().padStart(2, "0") },
          {
            label: "Approbations en attente",
            value: report.pendingApprovals.toString().padStart(2, "0"),
          },
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

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-panel rounded-[32px] p-6">
          <p className="eyebrow text-muted">
            Distribution du risque
          </p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Exposition des declarations par severite
          </h3>

          <div className="mt-6 space-y-4">
            {report.riskDistribution.map((item) => {
              const percentage =
                report.openDeclarations === 0 ? 0 : (item.count / report.openDeclarations) * 100;

              return (
                <div key={riskLabels[item.level]} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{riskLabels[item.level]}</span>
                    <span className="font-semibold text-foreground">
                      {item.count} / {report.openDeclarations}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-surface">
                    <div
                      className={`h-full rounded-full ${
                        item.level === "Critical"
                          ? "bg-danger"
                          : item.level === "High"
                            ? "bg-[#C96A1A]"
                            : item.level === "Medium"
                              ? "bg-warning"
                              : "bg-brand"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="surface-panel rounded-[32px] p-6">
          <p className="eyebrow text-muted">
            Sante du workflow
          </p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Execution des controles et de la remediation
          </h3>

          <div className="mt-6 space-y-4">
            {report.workflowMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{metric.label}</span>
                  <span className="font-semibold text-foreground">
                    {formatRate(metric.value)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: formatRate(metric.value) }}
                  />
                </div>
                <p className="text-sm text-muted">{metric.context}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-border bg-background px-5 py-4">
              <p className="text-sm text-muted">File superviseur</p>
              <p className="mt-3 font-heading text-3xl font-semibold text-foreground">
                {report.supervisorQueue}
              </p>
            </article>
            <article className="rounded-3xl border border-border bg-background px-5 py-4">
              <p className="text-sm text-muted">Declarations critiques</p>
              <p className="mt-3 font-heading text-3xl font-semibold text-foreground">
                {report.criticalDeclarations}
              </p>
            </article>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="table-panel p-6">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                Supervision du portefeuille
              </p>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                Tableau de suivi client
              </h3>
            </div>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong">
              {report.totalClients} clients
            </span>
          </div>

          <div className="table-shell mt-6">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Risque</th>
                  <th className="px-4 py-3 font-semibold">Charge workflow</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {report.portfolioRows.map((row) => (
                  <tr key={row.clientId} className="align-top hover:bg-background/60">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{row.clientName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                        Prochaine echeance {row.nextDeadline}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[row.riskLevel]}`}
                      >
                        {riskLabels[row.riskLevel]}
                      </span>
                      <p className="mt-2 text-sm text-muted">
                        {formatRate(row.controlCompletion)} de completion controle
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      <p>{row.openDeclarations} declarations ouvertes</p>
                      <p className="mt-2">{row.openAlerts} alertes / {row.openTasks} taches</p>
                      <p className="mt-2">{row.pendingApprovals} approbations en attente</p>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/clients/${row.clientId}`}
                        className="inline-flex rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
                      >
                        Ouvrir le client
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-panel rounded-[32px] p-6">
          <p className="eyebrow text-muted">
            Exposition principale
          </p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Declarations les plus risquees
          </h3>

          <div className="mt-6 space-y-4">
            {report.topRiskDeclarations.slice(0, 4).map((item) => (
              <article
                key={item.declarationId}
                className="soft-note rounded-[22px] px-5 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{item.clientName}</p>
                    <p className="mt-1 text-sm text-muted">
                      {item.obligationLabel} / {item.periodLabel}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[item.riskLevel]}`}
                  >
                    {item.totalScore}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{item.primaryDriver}</p>
                <div className="mt-4">
                  <Link
                    href={`/declarations/${item.declarationId}`}
                    className="inline-flex rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
                  >
                    Ouvrir la declaration
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}



