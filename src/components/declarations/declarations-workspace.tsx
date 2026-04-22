"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { declarationStatusLabels, riskLabels } from "@/lib/i18n/fr";
import {
  deleteLocalDeclaration,
  isLocalDeclarationRecord,
  type LocalDeclarationRecord,
} from "@/lib/local-declarations";
import type {
  DeclarationRecord,
  DeclarationRiskLevel,
  DeclarationStatus,
} from "@/lib/mock/declarations";
import { useLocalDeclarations } from "@/components/declarations/use-local-declarations";

type DeclarationWorkspaceProps = {
  initialDeclarations: DeclarationRecord[];
};

type FilterKey = "Tous" | "Urgent" | "En revue" | "En approbation" | "Crees";

const filters: FilterKey[] = ["Tous", "Urgent", "En revue", "En approbation", "Crees"];

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

function matchesFilter(
  declaration: DeclarationRecord | LocalDeclarationRecord,
  filter: FilterKey,
) {
  if (filter === "Tous") return true;
  if (filter === "Crees") return isLocalDeclarationRecord(declaration);
  if (filter === "Urgent") {
    return declaration.riskLevel === "High" || declaration.riskLevel === "Critical";
  }
  if (filter === "En revue") return declaration.status === "Pending review";
  if (filter === "En approbation") return declaration.status === "Pending approval";
  return true;
}

function matchesSearch(
  declaration: DeclarationRecord | LocalDeclarationRecord,
  search: string,
) {
  const normalized = search.trim().toLowerCase();

  if (!normalized) return true;

  return [
    declaration.clientName,
    declaration.obligationCode,
    declaration.obligationLabel,
    declaration.periodLabel,
    declaration.preparer,
    declaration.reviewer,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function DeclarationsWorkspace({
  initialDeclarations,
}: DeclarationWorkspaceProps) {
  const localDeclarations = useLocalDeclarations();
  const [filter, setFilter] = useState<FilterKey>("Tous");
  const [search, setSearch] = useState("");

  const declarations = useMemo(
    () => [...localDeclarations, ...initialDeclarations],
    [initialDeclarations, localDeclarations],
  );

  const filteredDeclarations = useMemo(
    () =>
      declarations.filter(
        (declaration) => matchesFilter(declaration, filter) && matchesSearch(declaration, search),
      ),
    [declarations, filter, search],
  );

  const summary = {
    total: declarations.length,
    urgent: declarations.filter(
      (item) => item.riskLevel === "High" || item.riskLevel === "Critical",
    ).length,
    blocked: declarations.filter((item) => item.status === "Pending docs").length,
    approval: declarations.filter((item) => item.status === "Pending approval").length,
    local: localDeclarations.length,
  };

  function handleDeleteLocal(declarationId: string) {
    deleteLocalDeclaration(declarationId);
  }

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow text-brand">Operations declaratives</p>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
              Workflow declaratif priorise par le risque et le statut de controle.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
              Ce module transforme les obligations recurrentes en dossiers operationnels avec
              echeances, responsables, blocages et statut d&apos;avancement.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/declarations/new" className="primary-button h-12 px-5 text-sm font-semibold">
              Creer un dossier
            </Link>
            <Link href="/risk-center" className="secondary-button h-12 px-5 text-sm font-semibold">
              Voir les risques
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        {[
          { label: "Declarations ouvertes", value: summary.total.toString().padStart(2, "0") },
          { label: "Dossiers prioritaires", value: summary.urgent.toString().padStart(2, "0") },
          { label: "Bloques sur documents", value: summary.blocked.toString().padStart(2, "0") },
          { label: "En attente d'approbation", value: summary.approval.toString().padStart(2, "0") },
          { label: "Crees dans ce navigateur", value: summary.local.toString().padStart(2, "0") },
        ].map((card) => (
          <article key={card.label} className="kpi-card rounded-[28px] p-5">
            <p className="eyebrow text-muted">{card.label}</p>
            <p className="metric-value mt-4 text-4xl text-foreground">{card.value}</p>
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
            <p className="mt-2 text-sm leading-6 text-muted">
              Les nouveaux dossiers sont conserves localement pour la demonstration PFE.
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[680px]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher client, obligation, periode..."
              className="app-input"
            />
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    item === filter
                      ? "bg-foreground text-white shadow-[0_10px_20px_rgba(18,26,34,0.12)]"
                      : "bg-surface text-muted"
                  }`}
                >
                  {item}
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
              {filteredDeclarations.map((declaration) => {
                const isLocal = isLocalDeclarationRecord(declaration);

                return (
                  <tr key={declaration.id} className="align-top hover:bg-background/60">
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{declaration.clientName}</p>
                        {isLocal ? (
                          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-strong">
                            Cree
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                        {declaration.obligationLabel} • {declaration.periodLabel}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        {declaration.missingDocuments} docs manquants • {declaration.totalAmount}
                      </p>
                      {isLocal ? (
                        <p className="mt-2 text-xs text-muted">
                          Score initial {declaration.riskScore} / {declaration.primaryDriver}
                        </p>
                      ) : null}
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
                    <td className="px-4 py-4 text-muted">{declaration.checklistCompletion}%</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/declarations/${declaration.id}`}
                          className="inline-flex rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
                        >
                          Ouvrir le dossier
                        </Link>
                        {isLocal ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteLocal(declaration.id)}
                            className="inline-flex rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-danger transition hover:border-danger/30"
                          >
                            Retirer
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDeclarations.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-border bg-surface px-5 py-8 text-center text-sm text-muted">
            Aucun dossier ne correspond au filtre actuel.
          </div>
        ) : null}
      </section>
    </div>
  );
}
