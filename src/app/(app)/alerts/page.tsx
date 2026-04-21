import Link from "next/link";

import { alertSeverityLabels, alertSourceLabels, alertStatusLabels } from '@/lib/i18n/fr';

import {
  getAlerts,
  getAlertSummary,
  type AlertSeverity,
  type AlertStatus,
} from "@/lib/mock/alerts";

const severityStyles: Record<AlertSeverity, string> = {
  Info: "bg-[#E7EEF7] text-[#2C6FA8]",
  Warning: "bg-warning-soft text-warning",
  High: "bg-[#F8E1D0] text-[#C96A1A]",
  Critical: "bg-danger-soft text-danger",
};

const statusStyles: Record<AlertStatus, string> = {
  Open: "bg-danger-soft text-danger",
  Acknowledged: "bg-warning-soft text-warning",
  Resolved: "bg-brand-soft text-brand-strong",
};

export default function AlertsPage() {
  const alerts = getAlerts();
  const summary = getAlertSummary();

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-brand">
            Alertes
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Exceptions operationnelles classees par severite et impact workflow.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Les alertes proviennent du risque, des echecs de controle et des gates d&apos;approbation en attente.
          </p>
        </div>

        <div className="soft-note rounded-[26px] px-5 py-4">
          <p className="text-sm text-muted">Perimetre des alertes</p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            Chaque alerte renvoie vers une declaration pour garder un chemin de remediation clair.
          </p>
        </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          { label: "Total alertes", value: summary.total.toString().padStart(2, "0") },
          { label: "Alertes critiques", value: summary.critical.toString().padStart(2, "0") },
          { label: "Alertes ouvertes", value: summary.open.toString().padStart(2, "0") },
          { label: "Prises en charge", value: summary.acknowledged.toString().padStart(2, "0") },
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
        <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              File des alertes
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Exceptions necessitant une action
            </h3>
          </div>
          <div className="soft-note rounded-[22px] px-4 py-3 text-sm text-muted">
            Ouvrir directement la declaration depuis l&apos;alerte.
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className="soft-note rounded-[24px] px-5 py-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{alert.title}</p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${severityStyles[alert.severity]}`}
                    >
                      {alertSeverityLabels[alert.severity]}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[alert.status]}`}
                    >
                      {alertStatusLabels[alert.status]}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {alert.clientName} / {alert.obligationLabel} / {alert.periodLabel}
                  </p>
                  <p className="text-sm leading-7 text-muted">{alert.message}</p>
                  <p className="text-sm text-muted">
                    Source : {alertSourceLabels[alert.source]} / Responsable : {alert.owner} / Echeance {alert.dueDate}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <p className="text-sm text-muted">Declenchee {alert.triggeredAt}</p>
                  <Link
                    href={`/declarations/${alert.declarationId}`}
                    className="secondary-button px-4 py-2 text-sm font-semibold"
                  >
                    Ouvrir le dossier
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}



