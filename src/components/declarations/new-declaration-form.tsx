"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  buildLocalDeclaration,
  calculateLocalRisk,
  saveLocalDeclaration,
  type NewDeclarationFormValues,
} from "@/lib/local-declarations";

type ClientOption = {
  id: string;
  tradeName: string;
  legalName: string;
  clientType: "PME" | "TPE";
  legalForm: string;
  city: string;
  accountManager: string;
  reviewer: string;
};

type NewDeclarationFormProps = {
  clients: ClientOption[];
};

const obligationOptions = [
  { code: "TVA", label: "TVA mensuelle" },
  { code: "IR_SAL", label: "IR / Salaires" },
  { code: "IS", label: "IS annuel" },
  { code: "IR_PRO", label: "IR professionnel" },
];

const steps = [
  "Client",
  "Obligation",
  "Documents",
  "Controles",
  "Validation",
] as const;

const defaultValues: NewDeclarationFormValues = {
  clientName: "Nouveau Client SARL",
  clientType: "PME",
  legalForm: "SARL",
  city: "Casablanca",
  obligationCode: "TVA",
  obligationLabel: "TVA mensuelle",
  periodLabel: "Avril 2026",
  dueDate: "2026-04-30",
  totalAmount: "0",
  preparer: "Nadia Tazi",
  reviewer: "Youssef Bennani",
  missingDocuments: 2,
  documentsReceived: 1,
  checklistCompletion: 45,
  hasConsistencyAlert: false,
  clientBehavior: "Retard leger",
  notes: "",
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function fieldNumber(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function NewDeclarationForm({ clients }: NewDeclarationFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState<NewDeclarationFormValues>(defaultValues);
  const [selectedClientId, setSelectedClientId] = useState("custom");

  const riskPreview = useMemo(() => calculateLocalRisk(values), [values]);

  function update<K extends keyof NewDeclarationFormValues>(
    key: K,
    value: NewDeclarationFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleClientChange(clientId: string) {
    setSelectedClientId(clientId);

    if (clientId === "custom") {
      return;
    }

    const client = clients.find((item) => item.id === clientId);

    if (!client) return;

    setValues((current) => ({
      ...current,
      clientName: client.tradeName,
      clientType: client.clientType,
      legalForm: client.legalForm,
      city: client.city,
      preparer: client.accountManager,
      reviewer: client.reviewer,
    }));
  }

  function handleObligationChange(code: string) {
    const selected = obligationOptions.find((item) => item.code === code);
    update("obligationCode", code);
    update("obligationLabel", selected?.label ?? code);
  }

  function handleSubmit() {
    const declaration = buildLocalDeclaration(values);
    saveLocalDeclaration(declaration);
    router.push(`/declarations/${declaration.id}`);
  }

  return (
    <div className="page-shell">
      <section className="page-hero p-7 sm:p-8 lg:p-9">
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-4">
            <p className="eyebrow text-brand">Creation de dossier</p>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3rem]">
              Assistant d&apos;insertion d&apos;un dossier declaratif.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
              Cette creation simule la methode professionnelle : identifier le client,
              ouvrir une obligation, rattacher les pieces, calculer le risque initial et
              preparer les controles avant revue.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/declarations" className="secondary-button px-5 py-3 text-sm font-semibold">
                Retour aux declarations
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Score initial", value: riskPreview.score.toString() },
              { label: "Niveau risque", value: riskPreview.level },
              { label: "Statut propose", value: riskPreview.status },
            ].map((item) => (
              <article key={item.label} className="auth-tile rounded-[24px] p-5">
                <p className="eyebrow text-muted">{item.label}</p>
                <p className="mt-3 font-heading text-2xl font-semibold text-foreground">
                  {item.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-[32px] p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`rounded-[22px] border px-4 py-4 text-left transition ${
                activeStep === index
                  ? "border-brand/30 bg-brand-soft text-brand-strong"
                  : "border-border bg-surface text-muted"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Etape {(index + 1).toString().padStart(2, "0")}
              </span>
              <span className="mt-2 block font-heading text-lg font-semibold">{step}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-panel rounded-[32px] p-6">
          {activeStep === 0 ? (
            <div className="space-y-5">
              <div>
                <p className="eyebrow text-muted">Etape 1</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                  Identifier le client
                </h3>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Client existant</span>
                <select
                  value={selectedClientId}
                  onChange={(event) => handleClientChange(event.target.value)}
                  className="app-input"
                >
                  <option value="custom">Nouveau client / saisie manuelle</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.tradeName} - {client.legalName}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Nom client</span>
                  <input
                    value={values.clientName}
                    onChange={(event) => update("clientName", event.target.value)}
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Type</span>
                  <select
                    value={values.clientType}
                    onChange={(event) => update("clientType", event.target.value as "PME" | "TPE")}
                    className="app-input"
                  >
                    <option value="PME">PME</option>
                    <option value="TPE">TPE</option>
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Forme juridique</span>
                  <input
                    value={values.legalForm}
                    onChange={(event) => update("legalForm", event.target.value)}
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Ville</span>
                  <input
                    value={values.city}
                    onChange={(event) => update("city", event.target.value)}
                    className="app-input"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {activeStep === 1 ? (
            <div className="space-y-5">
              <div>
                <p className="eyebrow text-muted">Etape 2</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                  Ouvrir l&apos;obligation fiscale
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Obligation</span>
                  <select
                    value={values.obligationCode}
                    onChange={(event) => handleObligationChange(event.target.value)}
                    className="app-input"
                  >
                    {obligationOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Periode</span>
                  <input
                    value={values.periodLabel}
                    onChange={(event) => update("periodLabel", event.target.value)}
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Echeance</span>
                  <input
                    type="date"
                    value={values.dueDate}
                    onChange={(event) => update("dueDate", event.target.value)}
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Montant estime MAD</span>
                  <input
                    type="number"
                    min="0"
                    value={values.totalAmount}
                    onChange={(event) => update("totalAmount", event.target.value)}
                    className="app-input"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="space-y-5">
              <div>
                <p className="eyebrow text-muted">Etape 3</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                  Rattacher les pieces et les manques
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Documents recus</span>
                  <input
                    type="number"
                    min="0"
                    value={values.documentsReceived}
                    onChange={(event) =>
                      update("documentsReceived", clampNumber(fieldNumber(event.target.value), 0, 50))
                    }
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Documents manquants</span>
                  <input
                    type="number"
                    min="0"
                    value={values.missingDocuments}
                    onChange={(event) =>
                      update("missingDocuments", clampNumber(fieldNumber(event.target.value), 0, 50))
                    }
                    className="app-input"
                  />
                </label>
              </div>

              <label className="flex items-start gap-3 rounded-[24px] border border-border bg-surface p-4">
                <input
                  type="checkbox"
                  checked={values.hasConsistencyAlert}
                  onChange={(event) => update("hasConsistencyAlert", event.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Signal d&apos;incoherence ou variation importante
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted">
                    Exemple : montant inhabituel, ecart non explique, document incoherent.
                  </span>
                </span>
              </label>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="space-y-5">
              <div>
                <p className="eyebrow text-muted">Etape 4</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                  Definir les controles et les responsables
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Preparateur</span>
                  <input
                    value={values.preparer}
                    onChange={(event) => update("preparer", event.target.value)}
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Relecteur</span>
                  <input
                    value={values.reviewer}
                    onChange={(event) => update("reviewer", event.target.value)}
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Avancement checklist</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={values.checklistCompletion}
                    onChange={(event) =>
                      update("checklistCompletion", clampNumber(fieldNumber(event.target.value), 0, 100))
                    }
                    className="app-input"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Comportement client</span>
                  <select
                    value={values.clientBehavior}
                    onChange={(event) =>
                      update(
                        "clientBehavior",
                        event.target.value as NewDeclarationFormValues["clientBehavior"],
                      )
                    }
                    className="app-input"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Retard leger">Retard leger</option>
                    <option value="Retard recurrent">Retard recurrent</option>
                  </select>
                </label>
              </div>
            </div>
          ) : null}

          {activeStep === 4 ? (
            <div className="space-y-5">
              <div>
                <p className="eyebrow text-muted">Etape 5</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                  Valider la creation
                </h3>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Note de creation</span>
                <textarea
                  value={values.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  rows={6}
                  className="app-input app-textarea"
                  placeholder="Exemple : dossier cree suite a reception partielle des pieces TVA."
                />
              </label>

              <div className="rounded-[26px] border border-border bg-surface p-5">
                <p className="font-semibold text-foreground">Synthese avant insertion</p>
                <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
                  <p>Client : {values.clientName}</p>
                  <p>Obligation : {values.obligationLabel}</p>
                  <p>Periode : {values.periodLabel}</p>
                  <p>Echeance : {values.dueDate}</p>
                  <p>Documents manquants : {values.missingDocuments}</p>
                  <p>Checklist : {values.checklistCompletion}%</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
              disabled={activeStep === 0}
              className="secondary-button px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Etape precedente
            </button>
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))}
                className="primary-button px-5 py-3 text-sm font-semibold"
              >
                Etape suivante
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="primary-button px-5 py-3 text-sm font-semibold"
              >
                Creer et ouvrir le dossier
              </button>
            )}
          </div>
        </article>

        <aside className="space-y-6">
          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">Apercu COSO</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
              Score de risque initial
            </h3>
            <p className="mt-5 font-heading text-5xl font-semibold tracking-[-0.05em] text-foreground">
              {riskPreview.score}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Facteur principal : {riskPreview.primaryDriver}
            </p>
            <div className="mt-5 space-y-3">
              {riskPreview.rules.length ? (
                riskPreview.rules.map((rule) => (
                  <div key={rule} className="soft-note rounded-[20px] px-4 py-3 text-sm text-muted">
                    {rule}
                  </div>
                ))
              ) : (
                <div className="soft-note rounded-[20px] px-4 py-3 text-sm text-muted">
                  Aucun signal critique a la creation.
                </div>
              )}
            </div>
          </article>

          <article className="surface-panel rounded-[32px] p-6">
            <p className="eyebrow text-muted">Ce que Laila genere</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <li>Score de risque initial.</li>
              <li>Statut du dossier.</li>
              <li>Blocages operationnels.</li>
              <li>Demandes documentaires.</li>
              <li>Checklist de controle de base.</li>
              <li>Historique de creation.</li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
