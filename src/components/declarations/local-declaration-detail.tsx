"use client";

import Link from "next/link";

import { declarationStatusLabels, riskLabels } from "@/lib/i18n/fr";
import { type LocalControlStatus } from "@/lib/local-declarations";
import type { DeclarationRiskLevel, DeclarationStatus } from "@/lib/mock/declarations";
import { useLocalDeclarations } from "@/components/declarations/use-local-declarations";

type LocalDeclarationDetailProps = {
  declarationId: string;
};

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

const controlStatusStyles: Record<LocalControlStatus, string> = {
  Pending: "bg-warning-soft text-warning",
  Completed: "bg-brand-soft text-brand-strong",
  Failed: "bg-danger-soft text-danger",
};

const controlStatusLabels: Record<LocalControlStatus, string> = {
  Pending: "En attente",
  Completed: "Complete",
  Failed: "Echec",
};

export function LocalDeclarationDetail({ declarationId }: LocalDeclarationDetailProps) {
  const localDeclarations = useLocalDeclarations();
  const declaration = localDeclarations.find((item) => item.id === declarationId) ?? null;

  if (!declaration) {
    return (
      <div className="page-shell">
        <section className="page-hero p-7 sm:p-8 lg:p-9">
          <div className="relative space-y-4">
            <p className="eyebrow text-danger">Dossier introuvable</p>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
              Ce dossier n&apos;existe pas dans les donnees de demonstration ni dans ce navigateur.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
              Les dossiers crees par l&apos;assistant sont stockes localement dans le navigateur.
              Si le stockage a ete vide ou si tu ouvres un autre navigateur, le dossier ne sera plus visible.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/declarations" className="secondary-button px-5 py-3 text-sm font-semibold">
                Retour aux declarations
              </Link>
              <Link href="/declarations/new" className="primary-button px-5 py-3 text-sm font-semibold">
                Creer un dossier
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong">
                Cree localement
              </span>
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong">
                {declaration.obligationCode}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles[declaration.status]}`}
              >
                {declarationStatusLabels[declaration.status]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[declaration.riskLevel]}`}
              >
                {riskLabels[declaration.riskLevel]} risque
              </span>
            </div>

            <div>
              <p className="eyebrow text-brand">Dossier declaratif cree</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3rem]">
                {declaration.clientName} / {declaration.obligationLabel}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                {declaration.periodLabel} / Echeance {declaration.dueDate} / Cree le{" "}
                {declaration.lastUpdated}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/declarations" className="secondary-button px-5 py-3 text-sm font-semibold">
                Retour aux declarations
              </Link>
              <Link href="/declarations/new" className="secondary-button px-5 py-3 text-sm font-semibold">
                Creer un autre dossier
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Preparateur", value: declaration.preparer, note: "Production du dossier" },
              { label: "Relecteur", value: declaration.reviewer, note: "Maker-checker" },
              { label: "Score risque", value: declaration.riskScore.toString(), note: declaration.primaryDriver },
              {
                label: "Documents",
                value: `${declaration.documentsReceived} recus`,
                note: `${declaration.missingDocuments} encore manquants`,
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
          { label: "Montant declare", value: declaration.totalAmount },
          { label: "Documents manquants", value: declaration.missingDocuments.toString() },
          { label: "Checklist completee", value: `${declaration.checklistCompletion}%` },
          { label: "Controles generes", value: declaration.generatedControls.length.toString().padStart(2, "0") },
        ].map((card) => (
          <article key={card.label} className="kpi-card rounded-[28px] p-5">
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Evaluation des risques</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Regles declenchees a la creation
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {declaration.generatedRules.length ? (
              declaration.generatedRules.map((rule) => (
                <article key={rule} className="soft-note rounded-[24px] px-5 py-4 text-sm leading-7 text-muted">
                  {rule}
                </article>
              ))
            ) : (
              <article className="soft-note rounded-[24px] px-5 py-4 text-sm leading-7 text-muted">
                Aucun signal critique a la creation.
              </article>
            )}
          </div>
        </article>

        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Blocages en cours</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Ce qui doit etre traite avant revue
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {declaration.blockers.map((blocker) => (
              <article
                key={blocker}
                className="rounded-[24px] border border-border bg-danger-soft px-5 py-4 text-sm leading-7 text-danger"
              >
                {blocker}
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Checklist generee</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Activites de controle initiales
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {declaration.generatedControls.map((control) => (
              <article key={control.id} className="soft-note rounded-[24px] px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{control.title}</p>
                      {control.mandatory ? (
                        <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-danger">
                          Obligatoire
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-muted">{control.category}</p>
                    <p className="mt-3 text-sm leading-7 text-muted">{control.note}</p>
                    <p className="mt-2 text-sm text-muted">Responsable : {control.owner}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${controlStatusStyles[control.status]}`}
                  >
                    {controlStatusLabels[control.status]}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Demandes documentaires</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Pieces a collecter
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {declaration.documentRequests.length ? (
              declaration.documentRequests.map((request) => (
                <article key={request.id} className="soft-note rounded-[24px] px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{request.title}</p>
                      <p className="mt-2 text-sm text-muted">Echeance {request.dueDate}</p>
                    </div>
                    <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-warning">
                      {request.status}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <article className="soft-note rounded-[24px] px-5 py-8 text-sm text-muted">
                Aucune piece manquante declaree lors de la creation.
              </article>
            )}
          </div>
        </article>
      </section>

      <section className="surface-panel rounded-[32px] p-6">
        <div>
          <p className="eyebrow text-muted">Historique</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Trace de creation du dossier
          </h3>
        </div>

        <div className="mt-6 space-y-4">
          {declaration.activity.map((entry) => (
            <article key={`${entry.title}-${entry.date}`} className="soft-note rounded-[24px] px-5 py-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <p className="font-semibold text-foreground">{entry.title}</p>
                <p className="font-mono text-sm text-muted">{entry.date}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{entry.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
