import fs from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";
import { SignJWT } from "jose";

const baseUrl = process.env.LAILA_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.resolve(process.cwd(), "..", "docs", "assets", "jury-screenshots");

const shots = [
  { file: "01-login.png", route: "/login" },
  { file: "02-dashboard.png", route: "/dashboard" },
  { file: "03-risk-center.png", route: "/risk-center" },
  { file: "04-client-atlas-agro.png", route: "/clients/atlas-agro" },
  { file: "05-declaration-atlas-tva.png", route: "/declarations/decl-atlas-tva-2026-03" },
  { file: "06-controls-atlas-tva.png", route: "/controls/decl-atlas-tva-2026-03" },
  { file: "07-approval-oasis-tva.png", route: "/approvals/decl-oasis-tva-2026-03" },
  { file: "08-alerts.png", route: "/alerts" },
  { file: "09-tasks.png", route: "/tasks" },
  { file: "10-reports.png", route: "/reports" },
];

async function capture(page, route, filename) {
  console.log(`Capturing ${route} -> ${filename}`);
  await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(outputDir, filename),
    fullPage: false,
  });
  console.log(`Saved ${filename}`);
}

async function buildSessionToken() {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8);
  const secret = new TextEncoder().encode("laila-prototype-development-secret");

  return new SignJWT({
    userId: "user-owner",
    fullName: "Sara El Idrissi",
    firmName: "Cabinet Atlas Fiduciaire",
    role: "OWNER",
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    locale: "fr-FR",
    colorScheme: "light",
    deviceScaleFactor: 1,
  });
  context.setDefaultNavigationTimeout(30000);
  context.setDefaultTimeout(30000);

  const page = await context.newPage();

  await capture(page, "/login", "01-login.png");

  const sessionToken = await buildSessionToken();
  await context.addCookies([
    {
      name: "laila_session",
      value: sessionToken,
      url: baseUrl,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  for (const shot of shots.slice(1)) {
    await capture(page, shot.route, shot.file);
  }

  await browser.close();

  console.log(`Captured ${shots.length} screenshots in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
