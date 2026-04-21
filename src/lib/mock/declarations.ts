export type DeclarationStatus =
  | "Pending docs"
  | "In preparation"
  | "Pending review"
  | "Pending approval"
  | "Approved";

export type DeclarationRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type DeclarationRecord = {
  id: string;
  clientId: string;
  clientName: string;
  obligationCode: string;
  obligationLabel: string;
  periodLabel: string;
  dueDate: string;
  status: DeclarationStatus;
  riskLevel: DeclarationRiskLevel;
  preparer: string;
  reviewer: string;
  missingDocuments: number;
  checklistCompletion: number;
  totalAmount: string;
  lastUpdated: string;
  blockers: string[];
  metrics: Array<{
    label: string;
    value: string;
    context: string;
  }>;
  activity: Array<{
    title: string;
    date: string;
    detail: string;
  }>;
};

export const declarations: DeclarationRecord[] = [
  {
    id: "decl-atlas-tva-2026-03",
    clientId: "atlas-agro",
    clientName: "Atlas Agro",
    obligationCode: "TVA",
    obligationLabel: "TVA mensuelle",
    periodLabel: "Mars 2026",
    dueDate: "20/04/2026",
    status: "Pending docs",
    riskLevel: "Critical",
    preparer: "Nadia Tazi",
    reviewer: "Youssef Bennani",
    missingDocuments: 4,
    checklistCompletion: 55,
    totalAmount: "124 600 MAD",
    lastUpdated: "18/04/2026",
    blockers: [
      "Deux factures d'achat non recues",
      "Rapprochement TVA collectee non valide",
    ],
    metrics: [
      {
        label: "Base imposable",
        value: "1 245 000 MAD",
        context: "+7.4% vs fevrier 2026",
      },
      {
        label: "TVA a payer",
        value: "124 600 MAD",
        context: "Au-dessus de la mediane portefeuille",
      },
      {
        label: "Avancement checklist",
        value: "55%",
        context: "Controles obligatoires incomplets",
      },
    ],
    activity: [
      {
        title: "Alerte critique declenchee",
        date: "18/04/2026",
        detail:
          "Les pieces manquantes et la checklist incomplete bloquent ce dossier avant revue.",
      },
      {
        title: "Relecteur assigne",
        date: "16/04/2026",
        detail: "Youssef Bennani a ete designe comme relecteur formel pour la TVA de mars.",
      },
    ],
  },
  {
    id: "decl-rif-irsal-2026-03",
    clientId: "rif-digital",
    clientName: "Rif Digital",
    obligationCode: "IR_SAL",
    obligationLabel: "IR / Salaires",
    periodLabel: "Mars 2026",
    dueDate: "30/04/2026",
    status: "In preparation",
    riskLevel: "High",
    preparer: "Ayoub Chraibi",
    reviewer: "Youssef Bennani",
    missingDocuments: 2,
    checklistCompletion: 68,
    totalAmount: "48 200 MAD",
    lastUpdated: "17/04/2026",
    blockers: ["Journal de paie encore en attente de verification finale"],
    metrics: [
      {
        label: "Masse salariale brute",
        value: "412 000 MAD",
        context: "+3.1% vs fevrier 2026",
      },
      {
        label: "IR a payer",
        value: "48 200 MAD",
        context: "Dans la fourchette attendue",
      },
      {
        label: "Avancement checklist",
        value: "68%",
        context: "Gate relecteur pas encore atteinte",
      },
    ],
    activity: [
      {
        title: "Preparation relancee",
        date: "17/04/2026",
        detail: "Le collaborateur a mis a jour les montants de paie apres correction client.",
      },
    ],
  },
  {
    id: "decl-sahara-is-2025",
    clientId: "sahara-retail",
    clientName: "Sahara Retail",
    obligationCode: "IS",
    obligationLabel: "IS annuel",
    periodLabel: "Exercice 2025",
    dueDate: "15/05/2026",
    status: "Pending review",
    riskLevel: "High",
    preparer: "Nadia Tazi",
    reviewer: "Sara El Idrissi",
    missingDocuments: 1,
    checklistCompletion: 82,
    totalAmount: "386 900 MAD",
    lastUpdated: "18/04/2026",
    blockers: ["Variance explanation requested by reviewer"],
    metrics: [
      {
        label: "Resultat fiscal",
        value: "1 547 600 MAD",
        context: "+18% vs exercice precedent",
      },
      {
        label: "IS due",
        value: "386 900 MAD",
        context: "Alerte anomalie declenchee",
      },
      {
        label: "Avancement checklist",
        value: "82%",
        context: "Pret pour commentaires relecteur",
      },
    ],
    activity: [
      {
        title: "Retour du relecteur",
        date: "17/04/2026",
        detail: "Une note justificative est demandee sur les provisions et charges exceptionnelles.",
      },
    ],
  },
  {
    id: "decl-oasis-tva-2026-03",
    clientId: "oasis-transit",
    clientName: "Oasis Transit",
    obligationCode: "TVA",
    obligationLabel: "TVA mensuelle",
    periodLabel: "Mars 2026",
    dueDate: "20/04/2026",
    status: "Pending approval",
    riskLevel: "Low",
    preparer: "Ayoub Chraibi",
    reviewer: "Youssef Bennani",
    missingDocuments: 0,
    checklistCompletion: 100,
    totalAmount: "77 300 MAD",
    lastUpdated: "18/04/2026",
    blockers: ["Validation superviseur en attente"],
    metrics: [
      {
        label: "Base imposable",
        value: "773 000 MAD",
        context: "Stable vs fevrier 2026",
      },
      {
        label: "TVA a payer",
        value: "77 300 MAD",
        context: "Tous les rapprochements sont completes",
      },
      {
        label: "Avancement checklist",
        value: "100%",
        context: "Maker-checker complete",
      },
    ],
    activity: [
      {
        title: "Relecteur approuve",
        date: "18/04/2026",
        detail:
          "Le dossier a ete transmis au superviseur apres validation de tous les controles obligatoires.",
      },
    ],
  },
];

export function getDeclarationById(declarationId: string) {
  return declarations.find((declaration) => declaration.id === declarationId);
}
