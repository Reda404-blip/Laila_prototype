import fs from "node:fs/promises";
import path from "node:path";

import { SignJWT } from "jose";
import { chromium } from "playwright";

const baseUrl = process.env.LAILA_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.resolve(process.cwd(), "..", "docs", "assets", "video-demo");
const outputFile = path.join(outputDir, "Laila_short_demo_silent.webm");

const steps = [
  { title: "Login", route: "/login", pause: 3200 },
  { title: "Dashboard", route: "/dashboard", pause: 5200 },
  { title: "Alerts", route: "/alerts", pause: 3600 },
  { title: "Tasks", route: "/tasks", pause: 3600 },
  { title: "Clients list", route: "/clients", pause: 4200 },
  {
    title: "Client detail",
    route: "/clients/atlas-agro",
    pause: 3200,
    scrolls: [900, 2050],
  },
  { title: "Declarations list", route: "/declarations", pause: 4200 },
  {
    title: "Declaration detail",
    route: "/declarations/decl-atlas-tva-2026-03",
    pause: 3400,
    scrolls: [1050, 2350],
  },
  { title: "Risk center", route: "/risk-center", pause: 5000, scrolls: [700] },
  { title: "Controls list", route: "/controls", pause: 4200 },
  {
    title: "Controls detail",
    route: "/controls/decl-atlas-tva-2026-03",
    pause: 3200,
    scrolls: [1100, 2550],
  },
  { title: "Approvals list", route: "/approvals", pause: 4200 },
  {
    title: "Approvals detail",
    route: "/approvals/decl-oasis-tva-2026-03",
    pause: 3200,
    scrolls: [1200],
  },
  {
    title: "Reports",
    route: "/reports",
    pause: 5000,
    scrolls: [1200],
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function animateScroll(page, y) {
  await page.evaluate(async (targetY) => {
    await new Promise((resolve) => {
      window.scrollTo({ top: targetY, behavior: "smooth" });
      window.setTimeout(resolve, 1200);
    });
  }, y);
}

async function playStep(page, step) {
  console.log(`Recording ${step.title} -> ${step.route}`);
  await page.goto(`${baseUrl}${step.route}`, { waitUntil: "load" });
  await wait(step.pause ?? 2500);

  if (step.scrolls?.length) {
    for (const position of step.scrolls) {
      await animateScroll(page, position);
      await wait(2200);
    }
    await animateScroll(page, 0);
    await wait(1200);
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  try {
    await fs.unlink(outputFile);
  } catch {}

  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    locale: "fr-FR",
    colorScheme: "light",
    deviceScaleFactor: 1,
    recordVideo: {
      dir: outputDir,
      size: { width: 1600, height: 1000 },
    },
  });
  context.setDefaultNavigationTimeout(30000);
  context.setDefaultTimeout(30000);

  const page = await context.newPage();
  const pageVideo = page.video();

  await playStep(page, steps[0]);

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

  for (const step of steps.slice(1)) {
    await playStep(page, step);
  }

  await wait(800);
  await context.close();

  const rawVideoPath = await pageVideo.path();
  await browser.close();

  await fs.copyFile(rawVideoPath, outputFile);

  console.log(`Short silent demo video exported to ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
