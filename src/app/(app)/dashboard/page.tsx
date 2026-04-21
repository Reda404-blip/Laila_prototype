import Link from "next/link";

import { getAlertSummary, getAlerts } from "@/lib/mock/alerts";
import { riskLabels } from '@/lib/i18n/fr';
import { formatRate, getReportSnapshot } from '@/lib/mock/reports';

export default function DashboardPage() {
  const alerts = getAlerts();
  const alertSummary = getAlertSummary();
  const report = getReportSnapshot();
  const riskQueue = report.topRiskDeclarations.slice(0, 3);

  const kpiCards = [
    {
      label: "Clients actifs",
      value: report.activeClients.toString().padStart(2, "0"),
      delta: `${report.totalClients} au total dans le portefeuille`,
    },
    {
      label: "Declarations a echeance",
      value: report.openDeclarations.toString().padStart(2, "0"),
      delta: `${report.highRiskDeclarations} avec risque eleve`,
    },
    {
      label: "Dossiers a risque eleve",
      value: alertSummary.critical.toString().padStart(2, "0"),
      delta: `${report.criticalDeclarations} critiques dans la file`,
    },
    {
      label: "Approbations en attente",
      value: report.pendingApprovals.toString().padStart(2, "0"),
      delta: `${report.supervisorQueue} avec validation superviseur en attente`,
    },
  ];

  const activityFeed = alerts.slice(0, 3).map((item) => item.title);

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="max-w-2xl space-y-4">
            <p className="eyebrow text-brand">
              Vue de pilotage
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3.2rem]">
              Pilotage du portefeuille selon le niveau de risque.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              Cette version montre deja la logique du produit :
              visibilite portefeuille, navigation protegee, et tableau de bord pret
              a exploiter des donnees reelles de declarations, alertes et approbations.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/risk-center"
                className="primary-button px-5 py-3 text-sm font-semibold"
              >
                Ouvrir le centre de risque
              </Link>
              <Link
                href="/reports"
                className="secondary-button px-5 py-3 text-sm font-semibold"
              >
                Voir les rapports
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Alertes ouvertes",
                value: alertSummary.open.toString().padStart(2, "0"),
                note: "Exceptions a traiter",
              },
              {
                label: "Taches ouvertes",
                value: report.openTasks.toString().padStart(2, "0"),
                note: "Remediation active",
              },
              {
                label: "File superviseur",
                value: report.supervisorQueue.toString().padStart(2, "0"),
                note: "Validation finale",
              },
              {
                label: "Niveau critique",
                value: report.criticalDeclarations.toString().padStart(2, "0"),
                note: "Dossiers a stabiliser",
              },
            ].map((item) => (
              <article key={item.label} className="auth-tile rounded-[24px] p-5">
                <p className="eyebrow text-muted">{item.label}</p>
                <p className="metric-value mt-3 text-4xl text-foreground">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <article
            key={card.label}
            className="kpi-card rounded-[28px] p-5"
          >
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">
              {card.value}
            </p>
            <p className="mt-3 max-w-[18rem] text-sm leading-6 text-muted">{card.delta}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <article className="table-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">
                File prioritaire
              </p>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                Declarations les plus risquees
              </h3>
            </div>
            <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-danger">
              {report.highRiskDeclarations} urgentes
            </span>
          </div>

          <div className="table-shell mt-6">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Declaration</th>
                  <th className="px-4 py-3 font-semibold">Risque</th>
                  <th className="px-4 py-3 font-semibold">Facteur principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {riskQueue.map((item) => (
                  <tr key={item.declarationId} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{item.clientName}</p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      <p>{item.obligationLabel}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em]">
                        {item.periodLabel}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                          item.riskLevel === "Critical"
                            ? "bg-danger-soft text-danger"
                            : "bg-warning-soft text-warning"
                        }`}
                      >
                        {riskLabels[item.riskLevel]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted">{item.primaryDriver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="space-y-6">
          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">
              Suivi
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Discipline de controle
            </h3>

            <div className="mt-6 space-y-4">
              {[
                {
                  label: "Taux de checklist",
                  value: formatRate(report.checklistCompletionRate),
                },
                {
                  label: "Pret pour revue",
                  value: formatRate(report.readyForReviewRate),
                },
                {
                  label: "Taches reliees",
                  value: formatRate(report.taskLinkageRate),
                },
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{metric.label}</span>
                    <span className="font-semibold text-foreground">
                      {metric.value}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,_rgba(31,138,130,1),_rgba(183,138,52,0.82))]"
                      style={{ width: metric.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">
              Activite
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Evenements de controle recents
            </h3>

            <ul className="mt-6 space-y-4">
              {activityFeed.map((item) => (
                <li
                  key={item}
                  className="soft-note rounded-[22px] px-4 py-3 text-sm leading-6 text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/alerts"
                className="secondary-button px-4 py-2 text-sm font-semibold"
              >
                Alertes ouvertes
              </Link>
              <Link
                href="/tasks"
                className="secondary-button px-4 py-2 text-sm font-semibold"
              >
                Taches ouvertes
              </Link>
              <Link
                href="/reports"
                className="secondary-button px-4 py-2 text-sm font-semibold"
              >
                Ouvrir les rapports
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}


