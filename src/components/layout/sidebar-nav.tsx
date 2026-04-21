"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  available: boolean;
  code: string;
  caption: string;
};

type SidebarNavProps = {
  items: NavItem[];
};

function isRouteActive(pathname: string, href: string, available: boolean) {
  return available && (pathname === href || pathname.startsWith(`${href}/`));
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav flex-1 space-y-1.5 px-3.5 py-4 xl:px-4">
      <p className="sidebar-section-label px-2.5 pb-2">Navigation</p>
      {items.map((item, index) => {
        const isActive = isRouteActive(pathname, item.href, item.available);
        const motionStyle = {
          "--nav-delay": `${180 + index * 42}ms`,
        } as CSSProperties;

        if (!item.available) {
          return (
            <div
              key={item.label}
              className="sidebar-nav-item sidebar-nav-item-muted"
              style={motionStyle}
            >
              <div className="flex items-center gap-3">
                <span className="sidebar-nav-code">
                  {item.code}
                </span>
                <span className="min-w-0">
                  <span className="block truncate">{item.label}</span>
                  <span className="block text-[0.66rem] uppercase tracking-[0.14em] text-white/34">
                    {item.caption}
                  </span>
                </span>
              </div>
              <span className="sidebar-nav-status">
                Bientot
              </span>
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`sidebar-nav-item group ${isActive ? "sidebar-nav-item-active" : ""}`}
            style={motionStyle}
          >
            <div className="flex items-center gap-3">
              <span className="sidebar-nav-code">
                {item.code}
              </span>
              <div className="min-w-0 space-y-0.5">
                <span className="block truncate">{item.label}</span>
                <span className="block truncate text-[0.66rem] uppercase tracking-[0.14em] text-white/38">
                  {item.caption}
                </span>
              </div>
            </div>
            <span className="sidebar-nav-status">
              {isActive ? "Actif" : "Pret"}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav mt-4 lg:hidden" aria-label="Navigation mobile">
      {items
        .filter((item) => item.available)
        .map((item) => {
          const isActive = isRouteActive(pathname, item.href, item.available);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? "mobile-nav-item-active" : ""}`}
            >
              <span className="mobile-nav-code">{item.code}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
    </nav>
  );
}

