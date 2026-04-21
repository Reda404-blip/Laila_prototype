import {
  declarations,
  getDeclarationById,
  type DeclarationRecord,
  type DeclarationRiskLevel,
  type DeclarationStatus,
} from "@/lib/mock/declarations";

export type ControlItemStatus = "Pending" | "Completed" | "Failed" | "Waived";

export type ControlCategory =
  | "Document completeness"
  | "Data validation"
  | "Reconciliation"
  | "Review gate";

export type ControlItemRecord = {
  id: string;
  declarationId: string;
  category: ControlCategory;
  title: string;
  description: string;
  mandatory: boolean;
  status: ControlItemStatus;
  owner: string;
  completedBy?: string;
  completedAt?: string;
  evidenceLabel?: string;
  note?: string;
};

export type ControlChecklistSummary = {
  declarationId: string;
  clientName: string;
  obligationLabel: string;
  periodLabel: string;
  dueDate: string;
  riskLevel: DeclarationRiskLevel;
  status: DeclarationStatus;
  completion: number;
  mandatoryRemaining: number;
  failedControls: number;
  evidenceAttached: number;
  readyForReview: boolean;
};

export type ControlChecklistDetail = ControlChecklistSummary & {
  preparer: string;
  reviewer: string;
  blockers: string[];
  lastUpdated: string;
  totalAmount: string;
  items: ControlItemRecord[];
};

const controlItems: ControlItemRecord[] = [
  {
    id: "ctrl-atlas-01",
    declarationId: "decl-atlas-tva-2026-03",
    category: "Document completeness",
    title: "Pack factures achat confirme",
    description: "Toutes les factures achat de mars doivent etre recues avant progression du dossier TVA.",
    mandatory: true,
    status: "Failed",
    owner: "Nadia Tazi",
    note: "Deux factures fournisseurs restent manquantes dans le dossier client.",
  },
  {
    id: "ctrl-atlas-02",
    declarationId: "decl-atlas-tva-2026-03",
    category: "Data validation",
    title: "Livre des ventes charge et valide",
    description: "Le livre des ventes TVA doit correspondre au fichier de travail declaratif.",
    mandatory: true,
    status: "Completed",
    owner: "Nadia Tazi",
    completedBy: "Nadia Tazi",
    completedAt: "18/04/2026 10:20",
    evidenceLabel: "VAT sales ledger v3",
  },
  {
    id: "ctrl-atlas-03",
    declarationId: "decl-atlas-tva-2026-03",
    category: "Reconciliation",
    title: "TVA collectee rapprochee avec les extractions comptables",
    description: "La TVA collectee doit etre rapprochee avant revue.",
    mandatory: true,
    status: "Pending",
    owner: "Nadia Tazi",
    note: "Un ecart reste non explique sur les ventes locales.",
  },
  {
    id: "ctrl-atlas-04",
    declarationId: "decl-atlas-tva-2026-03",
    category: "Reconciliation",
    title: "Credit reporte verifie",
    description: "Le credit reporte de la periode precedente doit correspondre a la declaration courante.",
    mandatory: true,
    status: "Completed",
    owner: "Nadia Tazi",
    completedBy: "Nadia Tazi",
    completedAt: "18/04/2026 09:45",
    evidenceLabel: "Feuille de report",
  },
  {
    id: "ctrl-atlas-05",
    declarationId: "decl-atlas-tva-2026-03",
    category: "Review gate",
    title: "Dossier relecteur assemble",
    description: "Le dossier doit inclure preuves, rapprochements et points ouverts avant revue.",
    mandatory: false,
    status: "Pending",
    owner: "Youssef Bennani",
  },
  {
    id: "ctrl-rif-01",
    declarationId: "decl-rif-irsal-2026-03",
    category: "Document completeness",
    title: "Journal de paie charge",
    description: "Le journal de paie est requis pour les controles IR salaires.",
    mandatory: true,
    status: "Completed",
    owner: "Ayoub Chraibi",
    completedBy: "Ayoub Chraibi",
    completedAt: "17/04/2026 15:05",
    evidenceLabel: "Journal de paie mars",
  },
  {
    id: "ctrl-rif-02",
    declarationId: "decl-rif-irsal-2026-03",
    category: "Document completeness",
    title: "Justificatif CNSS recu",
    description: "Le detail justificatif CNSS doit etre disponible avant revue.",
    mandatory: true,
    status: "Pending",
    owner: "Ayoub Chraibi",
    note: "Le client a promis le chargement avant le 22/04/2026.",
  },
  {
    id: "ctrl-rif-03",
    declarationId: "decl-rif-irsal-2026-03",
    category: "Data validation",
    title: "Total net de paie verifie",
    description: "Le total du journal de paie doit correspondre a la base fiscale declaree.",
    mandatory: true,
    status: "Completed",
    owner: "Ayoub Chraibi",
    completedBy: "Ayoub Chraibi",
    completedAt: "17/04/2026 16:10",
    evidenceLabel: "Feuille de rapprochement paie",
  },
  {
    id: "ctrl-rif-04",
    declarationId: "decl-rif-irsal-2026-03",
    category: "Reconciliation",
    title: "Variation du mois precedent expliquee",
    description: "Toute variation de paie par rapport a fevrier doit etre documentee.",
    mandatory: true,
    status: "Completed",
    owner: "Ayoub Chraibi",
    completedBy: "Ayoub Chraibi",
    completedAt: "17/04/2026 16:35",
    evidenceLabel: "Note ajustement RH",
  },
  {
    id: "ctrl-rif-05",
    declarationId: "decl-rif-irsal-2026-03",
    category: "Review gate",
    title: "Note de synthese relecteur preparee",
    description: "Le relecteur doit recevoir le resume de controle et les points ouverts.",
    mandatory: false,
    status: "Waived",
    owner: "Youssef Bennani",
    completedBy: "Youssef Bennani",
    completedAt: "18/04/2026 11:00",
    note: "Dispense car le dossier reste en preparation et la revue na pas commence.",
  },
  {
    id: "ctrl-sahara-01",
    declarationId: "decl-sahara-is-2025",
    category: "Document completeness",
    title: "Liasse de cloture chargee",
    description: "Le dossier fiscal annuel doit inclure la liasse de cloture et les etats principaux.",
    mandatory: true,
    status: "Completed",
    owner: "Nadia Tazi",
    completedBy: "Nadia Tazi",
    completedAt: "16/04/2026 17:45",
    evidenceLabel: "Liasse de cloture 2025",
  },
  {
    id: "ctrl-sahara-02",
    declarationId: "decl-sahara-is-2025",
    category: "Data validation",
    title: "Pont resultat comptable - resultat fiscal revu",
    description: "Le passage du resultat comptable au resultat fiscal doit etre documente.",
    mandatory: true,
    status: "Completed",
    owner: "Nadia Tazi",
    completedBy: "Nadia Tazi",
    completedAt: "17/04/2026 09:10",
    evidenceLabel: "Classeur passerelle fiscale",
  },
  {
    id: "ctrl-sahara-03",
    declarationId: "decl-sahara-is-2025",
    category: "Reconciliation",
    title: "Note sur charges exceptionnelles jointe",
    description: "Le relecteur a demande un support sur les provisions et charges exceptionnelles.",
    mandatory: true,
    status: "Failed",
    owner: "Nadia Tazi",
    note: "Le relecteur a retourne le dossier en attente dune note justificative.",
  },
  {
    id: "ctrl-sahara-04",
    declarationId: "decl-sahara-is-2025",
    category: "Reconciliation",
    title: "Comparatif exercice precedent documente",
    description: "Les variations importantes dun exercice a lautre doivent etre justifiees dans le dossier.",
    mandatory: true,
    status: "Completed",
    owner: "Nadia Tazi",
    completedBy: "Nadia Tazi",
    completedAt: "17/04/2026 11:20",
    evidenceLabel: "Note analyse de variation",
  },
  {
    id: "ctrl-sahara-05",
    declarationId: "decl-sahara-is-2025",
    category: "Review gate",
    title: "Retour relecteur enregistre",
    description: "Les dossiers retournes doivent porter une instruction claire de reprise.",
    mandatory: false,
    status: "Completed",
    owner: "Sara El Idrissi",
    completedBy: "Sara El Idrissi",
    completedAt: "17/04/2026 14:00",
    note: "Une explication de variation est requise avant approbation.",
  },
  {
    id: "ctrl-oasis-01",
    declarationId: "decl-oasis-tva-2026-03",
    category: "Document completeness",
    title: "Pack factures complet",
    description: "Le pack de factures de mars est complet et archive.",
    mandatory: true,
    status: "Completed",
    owner: "Ayoub Chraibi",
    completedBy: "Ayoub Chraibi",
    completedAt: "18/04/2026 08:40",
    evidenceLabel: "Pack factures mars",
  },
  {
    id: "ctrl-oasis-02",
    declarationId: "decl-oasis-tva-2026-03",
    category: "Data validation",
    title: "Base TVA conforme au livre des ventes",
    description: "La base declaree concorde avec le livre des ventes de travail.",
    mandatory: true,
    status: "Completed",
    owner: "Ayoub Chraibi",
    completedBy: "Ayoub Chraibi",
    completedAt: "18/04/2026 09:05",
    evidenceLabel: "Rapprochement livre des ventes",
  },
  {
    id: "ctrl-oasis-03",
    declarationId: "decl-oasis-tva-2026-03",
    category: "Reconciliation",
    title: "TVA collectee rapprochee",
    description: "Le rapprochement TVA est complet sans ecart ouvert.",
    mandatory: true,
    status: "Completed",
    owner: "Ayoub Chraibi",
    completedBy: "Ayoub Chraibi",
    completedAt: "18/04/2026 09:30",
    evidenceLabel: "Feuille de rapprochement TVA",
  },
  {
    id: "ctrl-oasis-04",
    declarationId: "decl-oasis-tva-2026-03",
    category: "Review gate",
    title: "Visa relecteur enregistre",
    description: "La validation maker-checker a ete finalisee avant approbation superviseur.",
    mandatory: true,
    status: "Completed",
    owner: "Youssef Bennani",
    completedBy: "Youssef Bennani",
    completedAt: "18/04/2026 10:15",
    evidenceLabel: "Note de visa relecteur",
  },
  {
    id: "ctrl-oasis-05",
    declarationId: "decl-oasis-tva-2026-03",
    category: "Review gate",
    title: "Gate superviseur ouverte",
    description: "Le dossier est formellement pret pour approbation superviseur.",
    mandatory: false,
    status: "Completed",
    owner: "Youssef Bennani",
    completedBy: "Youssef Bennani",
    completedAt: "18/04/2026 10:20",
    note: "La validation superviseur est la seule etape restante du workflow.",
  },
];

function getItemsForDeclaration(declarationId: string) {
  return controlItems.filter((item) => item.declarationId === declarationId);
}

function buildSummary(declaration: DeclarationRecord): ControlChecklistSummary {
  const items = getItemsForDeclaration(declaration.id);
  const mandatoryRemaining = items.filter(
    (item) => item.mandatory && item.status === "Pending",
  ).length;
  const failedControls = items.filter((item) => item.status === "Failed").length;
  const evidenceAttached = items.filter((item) => item.evidenceLabel).length;

  return {
    declarationId: declaration.id,
    clientName: declaration.clientName,
    obligationLabel: declaration.obligationLabel,
    periodLabel: declaration.periodLabel,
    dueDate: declaration.dueDate,
    riskLevel: declaration.riskLevel,
    status: declaration.status,
    completion: declaration.checklistCompletion,
    mandatoryRemaining,
    failedControls,
    evidenceAttached,
    readyForReview: mandatoryRemaining === 0 && failedControls === 0,
  };
}

const riskPriority: Record<DeclarationRiskLevel, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export function getControlChecklistSummaries() {
  return declarations
    .map(buildSummary)
    .sort((left, right) => {
      const riskGap = riskPriority[left.riskLevel] - riskPriority[right.riskLevel];

      if (riskGap !== 0) {
        return riskGap;
      }

      return right.failedControls - left.failedControls;
    });
}

export function getControlChecklistByDeclarationId(
  declarationId: string,
): ControlChecklistDetail | undefined {
  const declaration = getDeclarationById(declarationId);

  if (!declaration) {
    return undefined;
  }

  const summary = buildSummary(declaration);

  return {
    ...summary,
    preparer: declaration.preparer,
    reviewer: declaration.reviewer,
    blockers: declaration.blockers,
    lastUpdated: declaration.lastUpdated,
    totalAmount: declaration.totalAmount,
    items: getItemsForDeclaration(declarationId),
  };
}
