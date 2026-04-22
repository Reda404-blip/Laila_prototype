import Link from "next/link";

import { LocalDeclarationDetail } from "@/components/declarations/local-declaration-detail";
import {
  getDeclarationById,
  type DeclarationRiskLevel,
  type DeclarationStatus,
} from "@/lib/mock/declarations";
import {
  getDocumentsByDeclarationId,
  getDocumentRequestsByDeclarationId,
  type DocumentRequestStatus,
  type DocumentStatus,
} from "@/lib/mock/documents";
import {
  declarationStatusLabels,
  documentRequestStatusLabels,
  documentStatusLabels,
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

const documentStatusStyles: Record<DocumentStatus, string> = {
  Uploaded: "bg-[#E7EEF7] text-[#2C6FA8]",
  Verified: "bg-brand-soft text-brand-strong",
  Rejected: "bg-danger-soft text-danger",
};

const requestStatusStyles: Record<DocumentRequestStatus, string> = {
  Requested: "bg-warning-soft text-warning",
  Received: "bg-[#E7EEF7] text-[#2C6FA8]",
  Verified: "bg-brand-soft text-brand-strong",
  Overdue: "bg-danger-soft text-danger",
};

type DeclarationDetailPageProps = {
  params: Promise<{
    declarationId: string;
  }>;
};

export default async function DeclarationDetailPage({
  params,
}: DeclarationDetailPageProps) {
  const { declarationId } = await params;
  const declaration = getDeclarationById(declarationId);

  if (!declaration) {
    return <LocalDeclarationDetail declarationId={declarationId} />;
  }

  const linkedDocuments = getDocumentsByDeclarationId(declarationId);
  const linkedRequests = getDocumentRequestsByDeclarationId(declarationId);

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
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
              <p className="eyebrow text-brand">Dossier declaratif</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3rem]">
                {declaration.clientName} / {declaration.obligationLabel}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                {declaration.periodLabel} / Echeance {declaration.dueDate} / Mis a jour le{" "}
                {declaration.lastUpdated}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/declarations" className="secondary-button px-5 py-3 text-sm font-semibold">
                Retour aux declarations
              </Link>
              <Link href={`/controls/${declarationId}`} className="secondary-button px-5 py-3 text-sm font-semibold">
                Ouvrir la checklist
              </Link>
              <Link href={`/approvals/${declarationId}`} className="secondary-button px-5 py-3 text-sm font-semibold">
                Ouvrir approbation
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Preparateur",
                value: declaration.preparer,
                note: "Production du dossier",
              },
              {
                label: "Relecteur",
                value: declaration.reviewer,
                note: "Validation et commentaires",
              },
              {
                label: "Montant declare",
                value: declaration.totalAmount,
                note: "Valeur consolidee du dossier",
              },
              {
                label: "Echeance",
                value: declaration.dueDate,
                note: `${declaration.missingDocuments} documents encore manquants`,
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
          {
            label: "Checklist completee",
            value: `${declaration.checklistCompletion}%`,
          },
          { label: "Activites journalisees", value: declaration.activity.length.toString().padStart(2, "0") },
        ].map((card) => (
          <article key={card.label} className="kpi-card rounded-[28px] p-5">
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Indicateurs clefs</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Chiffres de travail
            </h3>
          </div>

          <div className="mt-6 grid gap-4">
            {declaration.metrics.map((metric) => (
              <article
                key={`${declaration.id}-${metric.label}`}
                className="soft-note rounded-[24px] px-5 py-4"
              >
                <p className="text-sm text-muted">{metric.label}</p>
                <p className="mt-3 font-heading text-3xl font-semibold text-foreground">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-muted">{metric.context}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Blocages en cours</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Ce qui bloque la progression
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {declaration.blockers.map((blocker) => (
              <article
                key={`${declaration.id}-${blocker}`}
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
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-muted">Demandes documentaires</p>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                Pieces manquantes et relances
              </h3>
            </div>
            <button type="button" className="secondary-button px-5 py-3 text-sm font-semibold">
              Demander une piece
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {linkedRequests.map((request) => (
              <article key={request.id} className="soft-note rounded-[24px] px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{request.title}</p>
                      {request.mandatory ? (
                        <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-danger">
                          Obligatoire
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted">
                      {request.documentType} / Contact {request.assignedContact}
                    </p>
                    <p className="text-sm leading-7 text-muted">{request.note}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${requestStatusStyles[request.status]}`}
                    >
                      {documentRequestStatusLabels[request.status]}
                    </span>
                    <p className="text-sm text-muted">Echeance {request.dueDate}</p>
                    <p className="text-sm text-muted">Demande par {request.requestedBy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Documents recus</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Pieces rattachees a ce dossier
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {linkedDocuments.length ? (
              linkedDocuments.map((document) => (
                <article key={document.id} className="soft-note rounded-[24px] px-5 py-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{document.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {document.documentType} / {document.fileName}
                      </p>
                      <p className="mt-3 text-sm text-muted">
                        {document.source} / Charge par {document.uploadedBy} le{" "}
                        {document.uploadedAt}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${documentStatusStyles[document.status]}`}
                    >
                      {documentStatusLabels[document.status]}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <article className="soft-note rounded-[24px] px-5 py-8 text-sm text-muted">
                Aucune piece rattachee pour cette declaration.
              </article>
            )}
          </div>
        </article>
      </section>

      <section className="surface-panel rounded-[32px] p-6">
        <div>
          <p className="eyebrow text-muted">Historique du dossier</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Activite recente de la declaration
          </h3>
        </div>

        <div className="mt-6 space-y-4">
          {declaration.activity.map((entry) => (
            <article
              key={`${declaration.id}-${entry.title}-${entry.date}`}
              className="soft-note rounded-[24px] px-5 py-4"
            >
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
