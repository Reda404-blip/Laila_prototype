import fs from "node:fs";
import path from "node:path";

import PptxGenJS from "pptxgenjs";

const rootDir = path.resolve(process.cwd(), "..");
const screenshotsDir = path.join(rootDir, "docs", "assets", "jury-screenshots");
const outputFile = path.join(rootDir, "docs", "Laila_Jury_Deck.pptx");
const presenterName = "Laila Sifou";
const schoolName = "ENCGO";
const supervisorName = "Abdelkarim Jabri";

const colors = {
  ink: "132130",
  teal: "0F6B66",
  sand: "F7F4EE",
  warm: "EDE6D9",
  white: "FFFFFF",
  brass: "B3872F",
  danger: "B74234",
  success: "2F7D5A",
  muted: "66788A",
};

function imagePath(file) {
  const resolved = path.join(screenshotsDir, file);
  return fs.existsSync(resolved) ? resolved : null;
}

function addFrame(slide, title, kicker = "Laila | Prototype PFE") {
  slide.background = { color: colors.sand };
  slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 0.5, fill: { color: colors.ink } });
  slide.addText(kicker, {
    x: 0.45,
    y: 0.16,
    w: 2.7,
    h: 0.16,
    color: colors.white,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    charSpace: 0.6,
  });
  slide.addText(title, {
    x: 0.55,
    y: 0.78,
    w: 7.9,
    h: 0.45,
    color: colors.ink,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
  });
  slide.addShape("line", {
    x: 0.55,
    y: 1.32,
    w: 1.55,
    h: 0,
    line: { color: colors.teal, pt: 2.25 },
  });
  slide.addText("PFE | Gouvernance interne | COSO | Cabinet fiduciaire marocain", {
    x: 0.55,
    y: 7.15,
    w: 6,
    h: 0.16,
    color: colors.muted,
    fontFace: "Aptos",
    fontSize: 9,
  });
}

function addBullets(slide, items, x, y, w, h, fontSize = 18) {
  slide.addText(
    items.map((text) => ({ text, options: { bullet: { indent: fontSize }, hanging: 3 } })),
    {
      x,
      y,
      w,
      h,
      fontFace: "Aptos",
      fontSize,
      color: colors.ink,
      breakLine: true,
      paraSpaceAfterPt: 12,
      valign: "top",
      margin: 0,
    },
  );
}

function addPill(slide, text, x, y, w) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h: 0.36,
    rectRadius: 0.08,
    fill: { color: colors.warm },
    line: { color: colors.teal, pt: 1 },
  });
  slide.addText(text, {
    x: x + 0.08,
    y: y + 0.08,
    w: w - 0.16,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    color: colors.teal,
    bold: true,
    align: "center",
  });
}

function addImageCard(slide, file, x, y, w, h, caption) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: colors.white },
    line: { color: "D8D2C7", pt: 1 },
    shadow: { type: "outer", color: "B8AE9D", angle: 45, blur: 2, distance: 1, opacity: 0.12 },
  });
  const src = imagePath(file);
  if (src) {
    slide.addImage({ path: src, x: x + 0.08, y: y + 0.08, w: w - 0.16, h: h - 0.44, sizing: "contain" });
  }
  slide.addText(caption, {
    x: x + 0.12,
    y: y + h - 0.28,
    w: w - 0.24,
    h: 0.15,
    fontFace: "Aptos",
    fontSize: 9,
    color: colors.muted,
    align: "center",
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "OpenAI Codex";
  pptx.company = "Laila Prototype";
  pptx.subject = "PFE Jury Deck";
  pptx.title = "Laila - Prototype de fiabilisation declarative";
  pptx.lang = "fr-FR";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "fr-FR",
  };

  {
    const slide = pptx.addSlide();
    slide.background = { color: colors.ink };
    slide.addShape("roundRect", {
      x: 0.55,
      y: 0.6,
      w: 5.6,
      h: 6.05,
      rectRadius: 0.12,
      fill: { color: "1A2B3D" },
      line: { color: "24415D", pt: 1 },
    });
    slide.addText("Laila", {
      x: 0.9,
      y: 1.02,
      w: 3.2,
      h: 0.45,
      color: colors.white,
      fontFace: "Aptos Display",
      fontSize: 27,
      bold: true,
    });
    slide.addText("Prototype de fiabilisation du processus declaratif fiscal par une approche COSO", {
      x: 0.9,
      y: 1.68,
      w: 4.55,
      h: 1.05,
      color: "E7EEF6",
      fontFace: "Aptos Display",
      fontSize: 20,
      bold: true,
      valign: "mid",
    });
    slide.addText("Application au contexte des cabinets fiduciaires accompagnant les PME/TPE marocaines", {
      x: 0.9,
      y: 2.92,
      w: 4.4,
      h: 0.62,
      color: "B8C8D8",
      fontFace: "Aptos",
      fontSize: 12,
    });
    addPill(slide, "COSO", 0.9, 4.04, 0.92);
    addPill(slide, "Risque", 1.94, 4.04, 1.1);
    addPill(slide, "Controle", 3.18, 4.04, 1.22);
    slide.addText(
      `${presenterName} | ${schoolName} | Encadrant : ${supervisorName} | PFE 2025-2026`,
      {
      x: 0.9,
      y: 5.42,
      w: 4.75,
      h: 0.26,
      color: "95A7BA",
      fontFace: "Aptos",
      fontSize: 9,
      },
    );
    addImageCard(slide, "02-dashboard.png", 6.55, 0.72, 6.15, 5.9, "Tableau de bord portefeuille");
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Contexte et probleme constate");
    addBullets(
      slide,
      [
        "Gestion de plusieurs clients en parallele par le cabinet",
        "Suivi souvent manuel des declarations et relances",
        "Documents manquants ou recus tardivement",
        "Controles peu formalises et validations informelles",
        "Manque de tracabilite et de vision portefeuille",
      ],
      0.75,
      1.75,
      5.55,
      4.65,
      19,
    );
    slide.addShape("roundRect", {
      x: 6.65,
      y: 1.8,
      w: 5.95,
      h: 4.7,
      rectRadius: 0.06,
      fill: { color: colors.white },
      line: { color: "D8D2C7", pt: 1 },
    });
    slide.addText("Avant Laila", {
      x: 6.95,
      y: 2.05,
      w: 2,
      h: 0.25,
      color: colors.ink,
      fontFace: "Aptos Display",
      fontSize: 18,
      bold: true,
    });
    const boxes = [
      ["Excel", 7.0, 2.55],
      ["E-mails", 9.05, 2.55],
      ["WhatsApp", 11.05, 2.55],
      ["Dossiers partages", 7.0, 3.65],
      ["Validation orale", 9.05, 3.65],
      ["Relances manuelles", 11.05, 3.65],
    ];
    for (const [label, x, y] of boxes) {
      slide.addShape("roundRect", {
        x,
        y,
        w: 1.55,
        h: 0.72,
        rectRadius: 0.06,
        fill: { color: colors.warm },
        line: { color: colors.teal, pt: 1 },
      });
      slide.addText(label, {
        x: Number(x) + 0.08,
        y: Number(y) + 0.18,
        w: 1.39,
        h: 0.2,
        fontFace: "Aptos",
        fontSize: 11,
        color: colors.ink,
        bold: true,
        align: "center",
      });
    }
    slide.addText("Resultat : processus fragile, peu trace, peu priorise.", {
      x: 6.95,
      y: 5.2,
      w: 4.8,
      h: 0.28,
      color: colors.danger,
      fontFace: "Aptos",
      fontSize: 14,
      bold: true,
    });
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Problematique et objectif");
    slide.addShape("roundRect", {
      x: 0.72,
      y: 1.78,
      w: 11.88,
      h: 1.8,
      rectRadius: 0.06,
      fill: { color: colors.white },
      line: { color: "D8D2C7", pt: 1 },
    });
    slide.addText(
      "Dans quelle mesure l'application des composantes Evaluation des risques et Activites de controle du referentiel COSO contribue-t-elle a fiabiliser le processus declaratif fiscal des PME/TPE marocaines accompagnees par un cabinet fiduciaire ?",
      {
        x: 1.0,
        y: 2.15,
        w: 11.3,
        h: 1.05,
        fontFace: "Aptos Display",
        fontSize: 20,
        color: colors.ink,
        bold: true,
        align: "center",
        valign: "mid",
      },
    );
    slide.addShape("roundRect", {
      x: 1.0,
      y: 4.25,
      w: 5.3,
      h: 1.55,
      rectRadius: 0.06,
      fill: { color: "D7EEEA" },
      line: { color: colors.teal, pt: 1 },
    });
    slide.addShape("roundRect", {
      x: 7.0,
      y: 4.25,
      w: 5.3,
      h: 1.55,
      rectRadius: 0.06,
      fill: { color: "F3E7C8" },
      line: { color: colors.brass, pt: 1 },
    });
    slide.addText("Axe 1\nEvaluation des risques", {
      x: 1.3,
      y: 4.68,
      w: 4.7,
      h: 0.56,
      fontFace: "Aptos Display",
      fontSize: 20,
      color: colors.teal,
      bold: true,
      align: "center",
    });
    slide.addText("Axe 2\nActivites de controle", {
      x: 7.3,
      y: 4.68,
      w: 4.7,
      h: 0.56,
      fontFace: "Aptos Display",
      fontSize: 20,
      color: colors.brass,
      bold: true,
      align: "center",
    });
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Traduction du COSO en logique logicielle");
    const headers = ["Composante COSO", "Signification pratique", "Traduction dans le prototype"];
    const rows = [
      ["Evaluation des risques", "Identifier les dossiers sensibles", "Score de risque declaration / client"],
      ["Evaluation des risques", "Detecter les signaux critiques", "Echeance, documents manquants, anomalies"],
      ["Activites de controle", "Standardiser les verifications", "Checklist obligatoire"],
      ["Activites de controle", "Separer les roles", "Maker-checker"],
      ["Activites de controle", "Bloquer les validations prematurees", "Gate d'approbation"],
      ["Monitoring", "Suivre les exceptions", "Alertes, taches, rapports"],
    ];
    slide.addTable([headers, ...rows], {
      x: 0.78,
      y: 1.85,
      w: 11.8,
      h: 4.85,
      border: { type: "solid", pt: 1, color: "D8D2C7" },
      fill: colors.white,
      color: colors.ink,
      fontFace: "Aptos",
      fontSize: 13,
      rowH: 0.62,
      valign: "mid",
      colW: [2.4, 3.6, 5.6],
      autoFit: false,
      margin: 0.08,
      bold: true,
      fillHeader: colors.teal,
      colorHeader: colors.white,
    });
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Solution proposee : Laila");
    slide.addText(
      "Un espace de pilotage fiduciaire centre sur le risque, le controle et la fiabilite declarative.",
      {
        x: 0.78,
        y: 1.66,
        w: 6.3,
        h: 0.52,
        fontFace: "Aptos Display",
        fontSize: 19,
        color: colors.ink,
        bold: true,
      },
    );
    const modules = [
      "Tableau de bord",
      "Clients",
      "Declarations",
      "Centre de risque",
      "Checklist de controle",
      "Approbations",
      "Alertes et taches",
      "Rapports",
    ];
    modules.forEach((label, index) => {
      const column = index < 4 ? 0 : 1;
      const row = index % 4;
      const x = column === 0 ? 0.9 : 3.55;
      const y = 2.55 + row * 0.88;
      slide.addShape("roundRect", {
        x,
        y,
        w: 2.15,
        h: 0.58,
        rectRadius: 0.06,
        fill: { color: column === 0 ? "D7EEEA" : "F3E7C8" },
        line: { color: column === 0 ? colors.teal : colors.brass, pt: 1 },
      });
      slide.addText(label, {
        x: x + 0.08,
        y: y + 0.17,
        w: 1.99,
        h: 0.16,
        fontFace: "Aptos",
        fontSize: 11,
        color: colors.ink,
        bold: true,
        align: "center",
      });
    });
    addImageCard(slide, "02-dashboard.png", 6.45, 1.7, 6.0, 4.9, "Espace de pilotage portefeuille");
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Workflow cible dans le prototype");
    const steps = [
      "Dossier client",
      "Obligation / declaration",
      "Risque",
      "Pieces",
      "Controles",
      "Revue",
      "Approbation",
      "Rapports",
    ];
    steps.forEach((step, index) => {
      const x = 0.7 + index * 1.55;
      slide.addShape("roundRect", {
        x,
        y: 3.0,
        w: 1.18,
        h: 0.9,
        rectRadius: 0.06,
        fill: { color: index % 2 === 0 ? "D7EEEA" : colors.white },
        line: { color: index % 2 === 0 ? colors.teal : "D8D2C7", pt: 1 },
      });
      slide.addText(step, {
        x: x + 0.07,
        y: 3.26,
        w: 1.04,
        h: 0.22,
        fontFace: "Aptos",
        fontSize: 10,
        color: colors.ink,
        bold: true,
        align: "center",
        valign: "mid",
      });
      if (index < steps.length - 1) {
        slide.addShape("chevron", {
          x: x + 1.2,
          y: 3.27,
          w: 0.24,
          h: 0.34,
          fill: { color: colors.brass },
          line: { color: colors.brass, pt: 1 },
        });
      }
    });
    slide.addText(
      "Le prototype suit une logique simple : identifier le risque, completer les pieces, executer les controles, valider formellement, puis superviser le portefeuille.",
      {
        x: 1.1,
        y: 5.2,
        w: 11.0,
        h: 0.7,
        fontFace: "Aptos",
        fontSize: 17,
        color: colors.ink,
        align: "center",
      },
    );
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Demonstration 1 : visibilite portefeuille et priorisation du risque");
    addImageCard(slide, "02-dashboard.png", 0.72, 1.72, 5.95, 4.85, "Tableau de bord portefeuille");
    addImageCard(slide, "03-risk-center.png", 6.72, 1.72, 5.9, 4.85, "Centre de risque");
    slide.addText(
      "Le manager voit immediatement les declarations sensibles et peut prioriser avant depot.",
      {
        x: 1.2,
        y: 6.72,
        w: 10.8,
        h: 0.28,
        fontFace: "Aptos",
        fontSize: 15,
        color: colors.teal,
        bold: true,
        align: "center",
      },
    );
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Demonstration 2 : dossier declaratif et activites de controle");
    addImageCard(slide, "05-declaration-atlas-tva.png", 0.72, 1.72, 5.95, 4.85, "Dossier declaratif centralise");
    addImageCard(slide, "06-controls-atlas-tva.png", 6.72, 1.72, 5.9, 4.85, "Checklist obligatoire");
    slide.addText(
      "Le risque visible est transforme en controles obligatoires et en blocages de progression.",
      {
        x: 1.1,
        y: 6.72,
        w: 10.9,
        h: 0.28,
        fontFace: "Aptos",
        fontSize: 15,
        color: colors.teal,
        bold: true,
        align: "center",
      },
    );
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Demonstration 3 : validation, remediation et supervision");
    addImageCard(slide, "07-approval-oasis-tva.png", 0.65, 1.8, 4.05, 4.55, "Approbation et maker-checker");
    addImageCard(slide, "08-alerts.png", 4.8, 1.8, 3.8, 4.55, "Alertes et exceptions");
    addImageCard(slide, "10-reports.png", 8.7, 1.8, 4.0, 4.55, "Rapports de supervision");
    slide.addText(
      "Les exceptions deviennent des alertes et des taches, puis remontent dans les rapports de supervision.",
      {
        x: 0.95,
        y: 6.62,
        w: 11.2,
        h: 0.36,
        fontFace: "Aptos",
        fontSize: 15,
        color: colors.teal,
        bold: true,
        align: "center",
      },
    );
  }

  {
    const slide = pptx.addSlide();
    addFrame(slide, "Apports, limites et perspectives");
    const columns = [
      {
        title: "Apports",
        color: colors.success,
        items: [
          "Traduction pratique du COSO",
          "Visibilite du risque avant depot",
          "Standardisation des controles",
          "Validation plus formelle",
          "Meilleure tracabilite",
        ],
      },
      {
        title: "Limites",
        color: colors.danger,
        items: [
          "Prototype de demonstration",
          "Donnees de demo realistes",
          "Persistance base de donnees encore partielle",
          "Pas de connexion directe aux plateformes fiscales",
        ],
      },
      {
        title: "Perspectives",
        color: colors.brass,
        items: [
          "PostgreSQL et workflows editables",
          "Notifications e-mail",
          "Portail client",
          "Analytique plus avancee",
          "Validation terrain",
        ],
      },
    ];
    columns.forEach((column, index) => {
      const x = 0.72 + index * 4.2;
      slide.addShape("roundRect", {
        x,
        y: 1.86,
        w: 3.72,
        h: 4.92,
        rectRadius: 0.06,
        fill: { color: colors.white },
        line: { color: "D8D2C7", pt: 1 },
      });
      slide.addText(column.title, {
        x: x + 0.18,
        y: 2.08,
        w: 2.2,
        h: 0.25,
        fontFace: "Aptos Display",
        fontSize: 18,
        color: column.color,
        bold: true,
      });
      addBullets(slide, column.items, x + 0.18, 2.55, 3.15, 3.8, 14);
    });
  }

  await pptx.writeFile({ fileName: outputFile });
  console.log(`PowerPoint deck generated at ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
