import Link from "next/link";

import { declarationStatusLabels, riskLabels } from '@/lib/i18n/fr';

import {
  getClientRiskSnapshots,
  getDeclarationRiskSnapshots,
  type RiskLevel,
} from "@/lib/mock/risk";

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-brand-soft text-brand-strong",
  Medium: "bg-warning-soft text-warning",
  High: "bg-[#F8E1D0] text-[#C96A1A]",
  Critical: "bg-danger-soft text-danger",
};

export default function RiskCenterPage() {
  const declarationSnapshots = getDeclarationRiskSnapshots();
  const clientSnapshots = getClientRiskSnapshots();

  const summary = {
    flaggedDeclarations: declarationSnapshots.filter((item) => item.totalScore >= 60)
      .length,
    criticalDeclarations: declarationSnapshots.filter(
      (item) => item.riskLevel === "Critical",
    ).length,
    exposedClients: clientSnapshots.filter((item) => item.totalScore >= 60).length,
    avgScore: Math.round(
      declarationSnapshots.reduce((sum, item) => sum + item.totalScore, 0) /
        declarationSnapshots.length,
    ),
  };

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="eyebrow text-brand">
            Centre de risque
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            Risque declaratif classe selon les preuves operationnelles.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Les scores sont calcules a partir des echeances, manques documentaires, faiblesses de workflow,
            signaux d&apos;anomalie et comportement de reponse client.
          </p>
        </div>

        <div className="soft-note rounded-[26px] px-5 py-4">
          <p className="text-sm text-muted">Poids du modele</p>
          <p className="mt-2 text-sm leading-7 text-foreground">
            Echeance 25 / Documents 25 / Cohérence 20 / Workflow 20 / Comportement 10
          </p>
        </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {[
          {
            label: "Declarations signalees",
            value: summary.flaggedDeclarations.toString().padStart(2, "0"),
          },
          {
            label: "Dossiers critiques",
            value: summary.criticalDeclarations.toString().padStart(2, "0"),
          },
          {
            label: "Clients exposes",
            value: summary.exposedClients.toString().padStart(2, "0"),
          },
          {
            label: "Score moyen de risque",
            value: summary.avgScore.toString().padStart(2, "0"),
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

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="table-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                File des declarations
              </p>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                Exposition la plus forte en premier
              </h3>
            </div>
            <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-danger">
              Priorite du jour
            </span>
          </div>

          <div className="table-shell mt-6">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-surface text-xs uppercase tracking-[0.16em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Declaration</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Facteur principal</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {declarationSnapshots.map((snapshot) => (
                  <tr key={snapshot.declarationId} className="align-top hover:bg-background/60">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{snapshot.clientName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                        {snapshot.obligationLabel} / {snapshot.periodLabel}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        Echeance {snapshot.dueDate} / {declarationStatusLabels[snapshot.status as keyof typeof declarationStatusLabels] ?? snapshot.status}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[snapshot.riskLevel]}`}
                        >
                          {riskLabels[snapshot.riskLevel]}
                        </span>
                        <p className="font-heading text-3xl font-semibold text-foreground">
                          {snapshot.totalScore}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      <p className="font-semibold text-foreground">{snapshot.primaryDriver}</p>
                      <ul className="mt-2 space-y-1">
                        {snapshot.triggeredRules.slice(0, 2).map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/declarations/${snapshot.declarationId}`}
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
        </article>

        <div className="space-y-6">
          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">
              Detail des composantes
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Atlas Agro / TVA Mars 2026
            </h3>

            {(() => {
              const top = declarationSnapshots[0];
              return (
                <div className="mt-6 space-y-4">
                  {[
                    { label: "Echeance", value: top.deadlineScore, max: 25 },
                    { label: "Documents", value: top.documentScore, max: 25 },
                    { label: "Coherence", value: top.consistencyScore, max: 20 },
                    { label: "Workflow", value: top.workflowScore, max: 20 },
                    { label: "Comportement", value: top.behaviorScore, max: 10 },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">{item.label}</span>
                        <span className="font-semibold text-foreground">
                          {item.value} / {item.max}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${(item.value / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </article>

          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">
              Exposition client
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Classement portefeuille
            </h3>

            <div className="mt-6 space-y-4">
              {clientSnapshots.map((snapshot) => (
                <article
                  key={snapshot.clientId}
                  className="soft-note rounded-[22px] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{snapshot.clientName}</p>
                      <p className="mt-1 text-sm text-muted">
                        {snapshot.openDeclarations} declarations ouvertes / {snapshot.overdueRequests} demandes
                        en retard
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[snapshot.riskLevel]}`}
                    >
                      {snapshot.totalScore}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-1 text-sm text-muted">
                    {snapshot.keyDrivers.map((driver) => (
                      <li key={driver}>{driver}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}


