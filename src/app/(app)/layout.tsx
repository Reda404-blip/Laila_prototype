import Image from "next/image";
import { redirect } from "next/navigation";

import { logout } from "@/app/actions/auth";
import { MobileNav, SidebarNav } from "@/components/layout/sidebar-nav";
import { getSession } from "@/lib/auth/session";

const navItems = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    available: true,
    code: "DB",
    caption: "Vue globale",
  },
  {
    label: "Alertes",
    href: "/alerts",
    available: true,
    code: "AL",
    caption: "Exceptions",
  },
  {
    label: "Taches",
    href: "/tasks",
    available: true,
    code: "TK",
    caption: "Remediation",
  },
  {
    label: "Clients",
    href: "/clients",
    available: true,
    code: "CL",
    caption: "Portefeuille",
  },
  {
    label: "Declarations",
    href: "/declarations",
    available: true,
    code: "DC",
    caption: "Workflow",
  },
  {
    label: "Centre de risque",
    href: "/risk-center",
    available: true,
    code: "RS",
    caption: "Priorisation",
  },
  {
    label: "Controles",
    href: "/controls",
    available: true,
    code: "CT",
    caption: "Checklist",
  },
  {
    label: "Approbations",
    href: "/approvals",
    available: true,
    code: "AP",
    caption: "Maker-checker",
  },
  {
    label: "Rapports",
    href: "/reports",
    available: true,
    code: "RP",
    caption: "Pilotage",
  },
  {
    label: "Parametres",
    href: "#",
    available: false,
    code: "ST",
    caption: "Configuration",
  },
];

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const activeRole =
    session.role === "OWNER" ? "Associe du cabinet" : "Relecteur fiscal";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="app-frame grid min-h-screen min-w-0 lg:grid-cols-[286px_minmax(0,1fr)] xl:grid-cols-[306px_minmax(0,1fr)] 2xl:grid-cols-[322px_minmax(0,1fr)]">
        <aside className="app-sidebar hidden min-w-0 text-sidebar-foreground lg:flex lg:flex-col">
          <div className="sidebar-shell">
            <div className="relative border-b border-white/8 px-4 py-4 xl:px-5">
              <div className="sidebar-brand-row">
                <div className="official-coso-logo official-coso-logo-sidebar">
                  <Image
                    src="/brand/coso-logo-official-tight.png"
                    alt="Logo officiel COSO"
                    width={64}
                    height={64}
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-brand-soft">
                    Laila
                  </p>
                  <p className="mt-1 truncate font-heading text-base font-semibold tracking-[-0.03em] text-white">
                    Control Desk
                  </p>
                </div>
                <span className="ml-auto rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/68">
                  PFE
                </span>
              </div>

              <div className="sidebar-masthead sidebar-command-card mt-4 rounded-[30px] p-4 xl:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand/18 bg-brand/12 px-3 py-1.5">
                    <span className="sidebar-pulse-dot" />
                    <span className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-brand-soft">
                      COSO Risk-Control
                    </span>
                  </div>
                  <span className="rounded-full border border-white/8 bg-white/6 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Live
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-[minmax(0,1fr)_4.8rem] items-center gap-4">
                  <div className="min-w-0">
                    <p className="sidebar-masthead-title">Control Hub</p>
                    <p className="mt-3 text-sm leading-6 text-white/62">
                      Risque, controle, preuve avant depot.
                    </p>
                  </div>
                  <div className="sidebar-risk-orbit" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="sidebar-confidence mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span>Score de fiabilite</span>
                    <strong>84%</strong>
                  </div>
                  <div className="sidebar-meter mt-2">
                    <span className="sidebar-meter-fill" />
                  </div>
                </div>

                <div className="sidebar-flow mt-5" aria-label="Flux de controle COSO">
                  {[
                    { label: "Risque", value: "Evaluer" },
                    { label: "Controle", value: "Verifier" },
                    { label: "Preuve", value: "Tracer" },
                  ].map((item) => (
                    <div key={item.label} className="sidebar-flow-step">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SidebarNav items={navItems} />

            <div className="px-4 pb-4 xl:px-5">
              <p className="sidebar-section-label pb-2">Contexte</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Mode", value: "Prototype PFE" },
                  { label: "Cycle", value: "Avril 2026" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="sidebar-insight-card rounded-[22px] px-3.5 py-3"
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-white/88 xl:text-sm">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto px-4 py-4 xl:px-5">
              <div className="sidebar-footer-card rounded-[26px] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Role actif
                </p>
                <p className="mt-2 font-heading text-base font-semibold text-white">
                  {activeRole}
                </p>
                <p className="mt-1 text-sm text-white/68">{session.fullName}</p>
                <p className="mt-3 text-[0.68rem] uppercase tracking-[0.18em] text-white/38">
                  {session.firmName}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="app-content-column flex min-h-screen min-w-0 flex-col">
          <header className="app-header">
            <div className="content-wrap px-4 py-4 sm:px-8 lg:py-5">
              <div className="mobile-brand-card mb-4 flex items-center justify-between gap-4 rounded-[24px] px-4 py-3 lg:hidden">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="official-coso-logo official-coso-logo-mobile">
                    <Image
                      src="/brand/coso-logo-official-tight.png"
                      alt="Logo officiel COSO"
                      width={56}
                      height={56}
                      priority
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-brand-strong">
                      Laila
                    </p>
                    <p className="truncate font-heading text-base font-semibold text-foreground">
                      Control Workspace
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-brand-strong">
                  COSO
                </span>
              </div>

              <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 space-y-2">
                  <p className="eyebrow text-muted">{session.firmName}</p>
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <h1 className="app-header-title font-heading text-[1.85rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.3rem]">
                        Pilotage du portefeuille
                      </h1>
                      <p className="mt-1 max-w-2xl text-sm leading-7 text-muted">
                        Vue manageriale des declarations, exceptions, controles et validations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="app-header-summary flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch xl:justify-end">
                  <div className="app-header-card rounded-3xl px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      Cycle actif
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">Avril 2026</p>
                  </div>
                  <div className="app-header-card rounded-3xl px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      Session
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {session.fullName}
                    </p>
                    <p className="text-xs text-muted">{activeRole}</p>
                  </div>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="secondary-button h-full min-h-12 px-5 text-sm font-semibold"
                    >
                      Se deconnecter
                    </button>
                  </form>
                </div>
              </div>

              <MobileNav items={navItems} />
            </div>
          </header>

          <main className="content-wrap min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


