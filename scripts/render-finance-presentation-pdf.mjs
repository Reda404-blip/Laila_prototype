import path from "node:path";
import { pathToFileURL } from "node:url";

import { chromium } from "playwright";

const rootDir = path.resolve(process.cwd(), "..");
const htmlFile = path.join(rootDir, "docs", "Laila_Presentation_PFE_Finance_FR.html");
const pdfFile = path.join(rootDir, "docs", "Laila_Presentation_PFE_Finance_FR.pdf");

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(htmlFile).href, {
    waitUntil: "load",
    timeout: 60000,
  });

  await page.pdf({
    path: pdfFile,
    format: "A4",
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
  });

  await browser.close();
  console.log(pdfFile);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
