import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/session";

const demoAccounts = [
  {
    title: "Associe du cabinet",
    email: "owner@laila.local",
    password: "Laila2026!",
  },
  {
    title: "Relecteur fiscal",
    email: "reviewer@laila.local",
    password: "Laila2026!",
  },
];

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="page-hero p-8 sm:p-10 lg:p-12">
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="official-coso-logo official-coso-logo-login">
                  <Image
                    src="/brand/coso-logo-official-tight.png"
                    alt="Logo officiel COSO"
                    width={84}
                    height={84}
                    priority
                  />
                </div>
                <div>
                  <div className="inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    Laila Prototype
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    COSO Risk-Control Workspace
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
                  Un cockpit fiduciaire plus net, plus lisible, plus defendable.
                </p>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  Un prototype SaaS premium qui transforme l&apos;evaluation des risques COSO et
                  les activites de controle en workflow declaratif structure.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "Vue portefeuille",
                    value: "Declarations prioritaires",
                    note: "Le manager voit immediatement les dossiers sensibles.",
                  },
                  {
                    label: "Controles formels",
                    value: "Checklist et gates",
                    note: "Le workflow impose un vrai passage maker-checker.",
                  },
                  {
                    label: "Surveillance",
                    value: "Alertes et taches",
                    note: "Les exceptions deviennent des actions structurees.",
                  },
                  {
                    label: "Pilotage",
                    value: "Rapports defendables",
                    note: "Le jury voit une logique manageriale, pas un simple CRUD.",
                  },
                ].map((item) => (
                  <article
                    key={item.label}
                    className="auth-tile rounded-[26px] p-5"
                  >
                    <p className="eyebrow text-muted">{item.label}</p>
                    <p className="mt-3 font-heading text-2xl font-semibold text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.note}</p>
                  </article>
                ))}
              </div>

              <div className="soft-note rounded-[28px] p-6">
                <p className="eyebrow text-brand">Angle PFE</p>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  Prototype de fiabilisation declarative
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Le produit montre comment un cabinet fiduciaire peut passer d&apos;un suivi
                  manuel a un poste de pilotage structure, trace et centre sur le risque.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Evaluation des risques visible par declaration",
                    "Activites de controle imposant une discipline formelle",
                    "Validation relecteur / superviseur plus facile a expliquer",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="auth-card w-full rounded-[32px] p-8 sm:p-10">
            <div className="space-y-2">
              <p className="eyebrow text-brand">
                Connexion securisee
              </p>
              <h1 className="font-heading text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Acceder au poste de pilotage
              </h1>
              <p className="max-w-md text-sm leading-7 text-muted">
                Cette premiere version utilise des comptes de demonstration pour valider l&apos;interface,
                la session et les routes protegees.
              </p>
            </div>

            <div className="mt-8">
              <LoginForm />
            </div>

            <div className="soft-note mt-8 rounded-[28px] p-5">
              <p className="eyebrow text-muted">
                Comptes de demonstration
              </p>
              <div className="mt-4 grid gap-3">
                {demoAccounts.map((account) => (
                  <div
                    key={account.email}
                    className="rounded-[22px] border border-border bg-white/82 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {account.title}
                    </p>
                    <p className="mt-1 font-mono text-sm text-muted">
                      {account.email}
                    </p>
                    <p className="font-mono text-sm text-muted">
                      {account.password}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


