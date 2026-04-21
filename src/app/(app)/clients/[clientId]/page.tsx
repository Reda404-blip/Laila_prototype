import Link from "next/link";
import { notFound } from "next/navigation";

import { documentRequestStatusLabels, riskLabels } from "@/lib/i18n/fr";
import { getClientById, type ClientRiskLevel } from "@/lib/mock/clients";
import { getDocumentReadinessByClientId } from "@/lib/mock/documents";

const riskStyles: Record<ClientRiskLevel, string> = {
  Low: "bg-brand-soft text-brand-strong",
  Medium: "bg-warning-soft text-warning",
  High: "bg-[#F8E1D0] text-[#C96A1A]",
  Critical: "bg-danger-soft text-danger",
};

type ClientDetailPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { clientId } = await params;
  const client = getClientById(clientId);

  if (!client) {
    notFound();
  }

  const documentReadiness = getDocumentReadinessByClientId(clientId);

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong">
                {client.code}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${riskStyles[client.riskLevel]}`}
              >
                {riskLabels[client.riskLevel]} risque
              </span>
            </div>

            <div>
              <p className="eyebrow text-brand">Dossier client</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3rem]">
                {client.tradeName}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                {client.legalName} / {client.legalForm} / {client.city} /{" "}
                {client.industry}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/clients" className="secondary-button px-5 py-3 text-sm font-semibold">
                Retour aux clients
              </Link>
              <Link href="/declarations" className="secondary-button px-5 py-3 text-sm font-semibold">
                Ouvrir les declarations
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Responsable dossier",
                value: client.accountManager,
                note: "Suivi quotidien et collecte",
              },
              {
                label: "Relecteur principal",
                value: client.reviewer,
                note: "Validation et commentaires",
              },
              {
                label: "Prochaine echeance",
                value: client.nextDeadline,
                note: "Date de pilotage prioritaire",
              },
              {
                label: "Charge active",
                value: `${client.openDeclarations} declarations`,
                note: `${client.openAlerts} alertes ouvertes`,
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
          {
            label: "Declarations ouvertes",
            value: client.openDeclarations.toString().padStart(2, "0"),
          },
          {
            label: "Documents manquants",
            value: client.missingDocuments.toString().padStart(2, "0"),
          },
          {
            label: "Alertes ouvertes",
            value: client.openAlerts.toString().padStart(2, "0"),
          },
          { label: "Demandes documentaires", value: documentReadiness.totalRequests.toString().padStart(2, "0") },
        ].map((card) => (
          <article key={card.label} className="kpi-card rounded-[28px] p-5">
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="surface-panel rounded-[32px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow text-muted">Preparation documentaire</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Pieces restantes a collecter pour ce client
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Demandes totales",
                value: documentReadiness.totalRequests.toString().padStart(2, "0"),
              },
              {
                label: "En retard",
                value: documentReadiness.overdue.toString().padStart(2, "0"),
              },
              {
                label: "En attente",
                value: documentReadiness.pending.toString().padStart(2, "0"),
              },
            ].map((card) => (
              <article key={card.label} className="soft-note rounded-[22px] px-5 py-4">
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                  {card.value}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {documentReadiness.requests.length ? (
            documentReadiness.requests.map((request) => (
              <article key={request.id} className="soft-note rounded-[24px] px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{request.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {request.documentType} / Echeance {request.dueDate}
                    </p>
                    <p className="mt-2 text-sm text-muted">{request.note}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {request.mandatory ? (
                      <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-danger">
                        Obligatoire
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                      {documentRequestStatusLabels[request.status]}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <article className="soft-note rounded-[24px] px-5 py-8 text-sm text-muted">
              Aucune relance documentaire ouverte pour ce client.
            </article>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Obligations fiscales</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Perimetre declaratif actuel
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {client.obligations.map((obligation) => (
              <article
                key={`${client.id}-${obligation.code}`}
                className="soft-note rounded-[24px] px-5 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{obligation.label}</p>
                    <p className="mt-1 text-sm text-muted">
                      {obligation.frequency} / Prochaine echeance {obligation.nextDueDate}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    {obligation.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="surface-panel rounded-[32px] p-6">
          <div>
            <p className="eyebrow text-muted">Contacts</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Contacts operationnels
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {client.contacts.map((contact) => (
              <article
                key={`${client.id}-${contact.email}`}
                className="soft-note rounded-[24px] px-5 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{contact.name}</p>
                    <p className="mt-1 text-sm text-muted">{contact.title}</p>
                  </div>
                  {contact.primary ? (
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong">
                      Principal
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 space-y-1 text-sm text-muted">
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="surface-panel rounded-[32px] p-6">
        <div>
          <p className="eyebrow text-muted">Activite recente</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
            Chronologie de controle du client
          </h3>
        </div>

        <div className="mt-6 space-y-4">
          {client.timeline.map((entry) => (
            <article
              key={`${client.id}-${entry.title}-${entry.date}`}
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
