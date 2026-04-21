import fs from "node:fs/promises";
import path from "node:path";

import { SignJWT } from "jose";
import { chromium } from "playwright";

const baseUrl = process.env.LAILA_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.resolve(process.cwd(), "..", "docs", "assets", "video-demo");
const outputFile = path.join(outputDir, "Laila_best_demo_detailed_silent.webm");
const sessionSecret =
  process.env.SESSION_SECRET ?? "laila-prototype-development-secret";

const steps = [
  { title: "Login and product positioning", route: "/login", pause: 32000 },
  { title: "Dashboard", route: "/dashboard", pause: 40000 },
  { title: "Alerts", route: "/alerts", pause: 28000 },
  { title: "Tasks", route: "/tasks", pause: 28000 },
  { title: "Clients portfolio", route: "/clients", pause: 34000 },
  {
    title: "Client detail",
    route: "/clients/atlas-agro",
    pause: 21200,
    scrolls: [520, 1200, 1850, 2500],
  },
  { title: "Declarations queue", route: "/declarations", pause: 32000 },
  {
    title: "Declaration detail",
    route: "/declarations/decl-atlas-tva-2026-03",
    pause: 26200,
    scrolls: [520, 1150, 1900, 2650],
  },
  {
    title: "Risk center",
    route: "/risk-center",
    pause: 30000,
    scrolls: [450, 950],
  },
  { title: "Controls queue", route: "/controls", pause: 33000 },
  {
    title: "Controls detail",
    route: "/controls/decl-atlas-tva-2026-03",
    pause: 29200,
    scrolls: [600, 1350, 2200, 3000],
  },
  { title: "Approvals queue", route: "/approvals", pause: 31000 },
  {
    title: "Approval detail",
    route: "/approvals/decl-oasis-tva-2026-03",
    pause: 24600,
    scrolls: [550, 1250, 2050],
  },
  {
    title: "Reports and conclusion",
    route: "/reports",
    pause: 28600,
    scrolls: [600, 1400, 2250],
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildSessionToken() {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8);

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
    .sign(new TextEncoder().encode(sessionSecret));
}

async function animateScroll(page, y) {
  await page.evaluate(async (targetY) => {
    await new Promise((resolve) => {
      window.scrollTo({ top: targetY, behavior: "smooth" });
      window.setTimeout(resolve, 1400);
    });
  }, y);
}

async function playStep(page, step) {
  console.log(`Recording ${step.title} -> ${step.route}`);
  await page.goto(`${baseUrl}${step.route}`, { waitUntil: "networkidle" });
  await wait(step.pause ?? 3000);

  if (step.scrolls?.length) {
    for (const position of step.scrolls) {
      await animateScroll(page, position);
      await wait(3000);
    }
    await animateScroll(page, 0);
    await wait(1800);
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  try {
    await fs.unlink(outputFile);
  } catch {}

  const launchOptions = {
    headless: true,
    ...(process.env.PW_BROWSER
      ? { executablePath: process.env.PW_BROWSER }
      : { channel: "msedge" }),
  };

  const browser = await chromium.launch(launchOptions);

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
  context.setDefaultNavigationTimeout(45000);
  context.setDefaultTimeout(45000);

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

  await wait(1200);
  await context.close();

  const rawVideoPath = await pageVideo.path();
  await browser.close();

  await fs.copyFile(rawVideoPath, outputFile);

  console.log(`Detailed silent demo exported to ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
