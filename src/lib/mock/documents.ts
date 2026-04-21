export type DocumentStatus = "Uploaded" | "Verified" | "Rejected";
export type DocumentSource = "Portal" | "Email" | "Manual";
export type DocumentRequestStatus =
  | "Requested"
  | "Received"
  | "Verified"
  | "Overdue";

export type DocumentRecord = {
  id: string;
  clientId: string;
  declarationId: string;
  title: string;
  documentType: string;
  fileName: string;
  source: DocumentSource;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
};

export type DocumentRequestRecord = {
  id: string;
  clientId: string;
  declarationId: string;
  title: string;
  documentType: string;
  assignedContact: string;
  requestedBy: string;
  dueDate: string;
  status: DocumentRequestStatus;
  mandatory: boolean;
  note: string;
  fulfilledDocumentId?: string;
};

export const documents: DocumentRecord[] = [
  {
    id: "doc-atlas-sales-ledger",
    clientId: "atlas-agro",
    declarationId: "decl-atlas-tva-2026-03",
    title: "Livre des ventes mars 2026",
    documentType: "Livre des ventes",
    fileName: "atlas-agro-sales-ledger-2026-03.xlsx",
    source: "Email",
    uploadedBy: "Nadia Tazi",
    uploadedAt: "16/04/2026",
    status: "Verified",
  },
  {
    id: "doc-rif-payroll-journal",
    clientId: "rif-digital",
    declarationId: "decl-rif-irsal-2026-03",
    title: "Journal de paie mars 2026",
    documentType: "Journal de paie",
    fileName: "rif-digital-payroll-2026-03.pdf",
    source: "Portal",
    uploadedBy: "Ayoub Chraibi",
    uploadedAt: "17/04/2026",
    status: "Uploaded",
  },
  {
    id: "doc-sahara-trial-balance",
    clientId: "sahara-retail",
    declarationId: "decl-sahara-is-2025",
    title: "Balance generale exercice 2025",
    documentType: "Balance generale",
    fileName: "sahara-retail-trial-balance-fy2025.xlsx",
    source: "Manual",
    uploadedBy: "Nadia Tazi",
    uploadedAt: "15/04/2026",
    status: "Verified",
  },
  {
    id: "doc-oasis-vat-reconciliation",
    clientId: "oasis-transit",
    declarationId: "decl-oasis-tva-2026-03",
    title: "Rapprochement TVA mars 2026",
    documentType: "Rapprochement TVA",
    fileName: "oasis-transit-vat-reco-2026-03.xlsx",
    source: "Portal",
    uploadedBy: "Ayoub Chraibi",
    uploadedAt: "18/04/2026",
    status: "Verified",
  },
];

export const documentRequests: DocumentRequestRecord[] = [
  {
    id: "req-atlas-purchase-invoices",
    clientId: "atlas-agro",
    declarationId: "decl-atlas-tva-2026-03",
    title: "Factures achat de mars",
    documentType: "Factures achat",
    assignedContact: "Salma El Fassi",
    requestedBy: "Nadia Tazi",
    dueDate: "17/04/2026",
    status: "Overdue",
    mandatory: true,
    note: "Les factures fournisseurs manquantes bloquent la revue TVA.",
  },
  {
    id: "req-atlas-export-support",
    clientId: "atlas-agro",
    declarationId: "decl-atlas-tva-2026-03",
    title: "Justificatifs export",
    documentType: "Justificatif export",
    assignedContact: "Hicham Rami",
    requestedBy: "Nadia Tazi",
    dueDate: "18/04/2026",
    status: "Requested",
    mandatory: true,
    note: "Necessaire pour justifier les ventes a taux zero.",
  },
  {
    id: "req-rif-cnss",
    clientId: "rif-digital",
    declarationId: "decl-rif-irsal-2026-03",
    title: "Bordereau recapitulatif CNSS",
    documentType: "Bordereau CNSS",
    assignedContact: "Imane Jebbari",
    requestedBy: "Ayoub Chraibi",
    dueDate: "19/04/2026",
    status: "Received",
    mandatory: true,
    note: "Recu, en attente de verification avec le journal de paie.",
    fulfilledDocumentId: "doc-rif-payroll-journal",
  },
  {
    id: "req-sahara-provisions-note",
    clientId: "sahara-retail",
    declarationId: "decl-sahara-is-2025",
    title: "Note de direction sur les provisions",
    documentType: "Note de direction",
    assignedContact: "Karim Ouazzani",
    requestedBy: "Sara El Idrissi",
    dueDate: "20/04/2026",
    status: "Requested",
    mandatory: true,
    note: "Le relecteur a demande une note narrative sur la variation fiscale annuelle.",
  },
  {
    id: "req-oasis-bank-reco",
    clientId: "oasis-transit",
    declarationId: "decl-oasis-tva-2026-03",
    title: "Justificatif rapprochement bancaire",
    documentType: "Rapprochement bancaire",
    assignedContact: "Soufiane Lahlou",
    requestedBy: "Ayoub Chraibi",
    dueDate: "18/04/2026",
    status: "Verified",
    mandatory: false,
    note: "Piece optionnelle completee avant approbation superviseur.",
    fulfilledDocumentId: "doc-oasis-vat-reconciliation",
  },
];

export function getDocumentsByDeclarationId(declarationId: string) {
  return documents.filter((document) => document.declarationId === declarationId);
}

export function getDocumentRequestsByDeclarationId(declarationId: string) {
  return documentRequests.filter(
    (documentRequest) => documentRequest.declarationId === declarationId,
  );
}

export function getDocumentRequestsByClientId(clientId: string) {
  return documentRequests.filter(
    (documentRequest) => documentRequest.clientId === clientId,
  );
}

export function getDocumentReadinessByClientId(clientId: string) {
  const requests = getDocumentRequestsByClientId(clientId);

  return {
    totalRequests: requests.length,
    overdue: requests.filter((request) => request.status === "Overdue").length,
    pending: requests.filter((request) =>
      ["Requested", "Received"].includes(request.status),
    ).length,
    verified: requests.filter((request) => request.status === "Verified").length,
    requests,
  };
}
