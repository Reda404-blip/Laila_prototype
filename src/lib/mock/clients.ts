export type ClientRiskLevel = "Low" | "Medium" | "High" | "Critical";
export type ClientStatus = "Active" | "Onboarding" | "Watchlist";

export type ClientRecord = {
  id: string;
  code: string;
  legalName: string;
  tradeName: string;
  clientType: "PME" | "TPE";
  legalForm: string;
  industry: string;
  city: string;
  accountManager: string;
  reviewer: string;
  status: ClientStatus;
  riskLevel: ClientRiskLevel;
  nextDeadline: string;
  openDeclarations: number;
  missingDocuments: number;
  openAlerts: number;
  obligations: Array<{
    code: string;
    label: string;
    frequency: string;
    nextDueDate: string;
    status: string;
  }>;
  contacts: Array<{
    name: string;
    title: string;
    email: string;
    phone: string;
    primary?: boolean;
  }>;
  timeline: Array<{
    title: string;
    date: string;
    detail: string;
  }>;
};

export const clients: ClientRecord[] = [
  {
    id: "atlas-agro",
    code: "CLI-001",
    legalName: "Atlas Agro Distribution SARL",
    tradeName: "Atlas Agro",
    clientType: "PME",
    legalForm: "SARL",
    industry: "Agro-distribution",
    city: "Casablanca",
    accountManager: "Nadia Tazi",
    reviewer: "Youssef Bennani",
    status: "Active",
    riskLevel: "Critical",
    nextDeadline: "20/04/2026",
    openDeclarations: 3,
    missingDocuments: 4,
    openAlerts: 3,
    obligations: [
      {
        code: "TVA",
        label: "TVA mensuelle",
        frequency: "Mensuelle",
        nextDueDate: "20/04/2026",
        status: "Documents manquants",
      },
      {
        code: "IR_SAL",
        label: "IR / Salaires",
        frequency: "Mensuelle",
        nextDueDate: "30/04/2026",
        status: "En préparation",
      },
    ],
    contacts: [
      {
        name: "Salma El Fassi",
        title: "Gérante",
        email: "salma@atlas-agro.ma",
        phone: "+212 661 25 18 31",
        primary: true,
      },
      {
        name: "Hicham Rami",
        title: "Responsable administratif",
        email: "h.rami@atlas-agro.ma",
        phone: "+212 662 77 09 40",
      },
    ],
    timeline: [
      {
        title: "Alerte critique déclenchée",
        date: "17/04/2026",
        detail: "Deux factures d’achat restent manquantes pour la TVA de mars 2026.",
      },
      {
        title: "Checklist incomplète",
        date: "16/04/2026",
        detail: "Le contrôle de rapprochement ventes / TVA collectée n’est pas validé.",
      },
      {
        title: "Demande documentaire envoyée",
        date: "14/04/2026",
        detail: "Relance client sur justificatifs de ventes export.",
      },
    ],
  },
  {
    id: "rif-digital",
    code: "CLI-002",
    legalName: "Rif Digital Services",
    tradeName: "Rif Digital",
    clientType: "PME",
    legalForm: "SARL AU",
    industry: "Services numériques",
    city: "Tanger",
    accountManager: "Ayoub Chraibi",
    reviewer: "Youssef Bennani",
    status: "Active",
    riskLevel: "High",
    nextDeadline: "30/04/2026",
    openDeclarations: 2,
    missingDocuments: 2,
    openAlerts: 2,
    obligations: [
      {
        code: "IR_SAL",
        label: "IR / Salaires",
        frequency: "Mensuelle",
        nextDueDate: "30/04/2026",
        status: "Reviewer non assigné",
      },
      {
        code: "TVA",
        label: "TVA mensuelle",
        frequency: "Mensuelle",
        nextDueDate: "20/04/2026",
        status: "En revue",
      },
    ],
    contacts: [
      {
        name: "Imane Jebbari",
        title: "Directrice financière",
        email: "imane@rif-digital.ma",
        phone: "+212 664 91 25 70",
        primary: true,
      },
    ],
    timeline: [
      {
        title: "Anomalie de workflow",
        date: "17/04/2026",
        detail: "Le dossier IR salaires n’a pas encore de reviewer assigné.",
      },
      {
        title: "Documents reçus",
        date: "15/04/2026",
        detail: "Bordereau CNSS et livre de paie transmis.",
      },
    ],
  },
  {
    id: "sahara-retail",
    code: "CLI-003",
    legalName: "Sahara Retail Maroc",
    tradeName: "Sahara Retail",
    clientType: "PME",
    legalForm: "SARL",
    industry: "Commerce de détail",
    city: "Marrakech",
    accountManager: "Nadia Tazi",
    reviewer: "Sara El Idrissi",
    status: "Watchlist",
    riskLevel: "High",
    nextDeadline: "15/05/2026",
    openDeclarations: 1,
    missingDocuments: 1,
    openAlerts: 2,
    obligations: [
      {
        code: "IS",
        label: "IS annuel",
        frequency: "Annuelle",
        nextDueDate: "15/05/2026",
        status: "Variance détectée",
      },
    ],
    contacts: [
      {
        name: "Karim Ouazzani",
        title: "Associé gérant",
        email: "karim@sahara-retail.ma",
        phone: "+212 667 38 14 05",
        primary: true,
      },
    ],
    timeline: [
      {
        title: "Écart fiscal relevé",
        date: "16/04/2026",
        detail: "L’IS estimé dépasse de 18% la période précédente.",
      },
      {
        title: "Retour reviewer",
        date: "13/04/2026",
        detail: "Demande de justification sur provisions exceptionnelles.",
      },
    ],
  },
  {
    id: "medina-craft",
    code: "CLI-004",
    legalName: "Medina Craft Atelier",
    tradeName: "Medina Craft",
    clientType: "TPE",
    legalForm: "Entreprise individuelle",
    industry: "Artisanat",
    city: "Fès",
    accountManager: "Ayoub Chraibi",
    reviewer: "Youssef Bennani",
    status: "Active",
    riskLevel: "Medium",
    nextDeadline: "20/04/2026",
    openDeclarations: 2,
    missingDocuments: 1,
    openAlerts: 1,
    obligations: [
      {
        code: "TVA",
        label: "TVA mensuelle",
        frequency: "Mensuelle",
        nextDueDate: "20/04/2026",
        status: "En préparation",
      },
      {
        code: "IR_PRO",
        label: "IR professionnel",
        frequency: "Annuelle",
        nextDueDate: "31/12/2026",
        status: "Planifié",
      },
    ],
    contacts: [
      {
        name: "Fatima Bennis",
        title: "Propriétaire",
        email: "fatima@medinacraft.ma",
        phone: "+212 660 55 81 92",
        primary: true,
      },
    ],
    timeline: [
      {
        title: "Demande de pièce complémentaire",
        date: "15/04/2026",
        detail: "Facture fournisseur manquante pour l’achat de matières premières.",
      },
    ],
  },
  {
    id: "argan-labs",
    code: "CLI-005",
    legalName: "Argan Labs SAS",
    tradeName: "Argan Labs",
    clientType: "PME",
    legalForm: "SAS",
    industry: "Cosmétique",
    city: "Agadir",
    accountManager: "Nadia Tazi",
    reviewer: "Sara El Idrissi",
    status: "Onboarding",
    riskLevel: "Medium",
    nextDeadline: "05/05/2026",
    openDeclarations: 1,
    missingDocuments: 2,
    openAlerts: 1,
    obligations: [
      {
        code: "TVA",
        label: "TVA mensuelle",
        frequency: "Mensuelle",
        nextDueDate: "20/05/2026",
        status: "Paramétrage en cours",
      },
    ],
    contacts: [
      {
        name: "Meryem Akhrif",
        title: "DAF",
        email: "meryem@arganlabs.ma",
        phone: "+212 665 44 18 22",
        primary: true,
      },
    ],
    timeline: [
      {
        title: "Onboarding démarré",
        date: "11/04/2026",
        detail: "Paramétrage des obligations fiscales et collecte des pièces légales.",
      },
    ],
  },
  {
    id: "oasis-transit",
    code: "CLI-006",
    legalName: "Oasis Transit Logistics",
    tradeName: "Oasis Transit",
    clientType: "PME",
    legalForm: "SARL",
    industry: "Logistique",
    city: "Kénitra",
    accountManager: "Ayoub Chraibi",
    reviewer: "Youssef Bennani",
    status: "Active",
    riskLevel: "Low",
    nextDeadline: "20/04/2026",
    openDeclarations: 2,
    missingDocuments: 0,
    openAlerts: 0,
    obligations: [
      {
        code: "TVA",
        label: "TVA mensuelle",
        frequency: "Mensuelle",
        nextDueDate: "20/04/2026",
        status: "Prête pour revue",
      },
      {
        code: "IR_SAL",
        label: "IR / Salaires",
        frequency: "Mensuelle",
        nextDueDate: "30/04/2026",
        status: "Planifié",
      },
    ],
    contacts: [
      {
        name: "Soufiane Lahlou",
        title: "Responsable comptable",
        email: "soufiane@oasistransit.ma",
        phone: "+212 663 70 41 67",
        primary: true,
      },
    ],
    timeline: [
      {
        title: "Contrôles complétés",
        date: "17/04/2026",
        detail: "Tous les contrôles obligatoires TVA mars 2026 sont validés.",
      },
    ],
  },
];

export function getClientById(clientId: string) {
  return clients.find((client) => client.id === clientId);
}
