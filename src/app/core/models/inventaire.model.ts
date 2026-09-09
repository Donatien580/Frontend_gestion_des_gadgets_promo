export type TypeInventaire = "TRIMESTRIEL" | "EXCEPTIONNEL";
export type EtatInventaire = "EN_COURS" | "TERMINE" | "VALIDE";

export interface LigneInventaire {
  idLigne: number;
  idGadget: number;
  libelleGadget: string;
  stockTheorique: number;
  stockReel: number;
  ecart: number;
  justification: string | null;
  validationJustif: boolean;
}

export interface Inventaire {
  idInventaire: number;
  dateInventaire: string;
  typeInventaire: TypeInventaire;
  etat: EtatInventaire;
  observations: string | null;
  realisateur: string | null;
  lignes: LigneInventaire[];
  dateCreation: string;
}

export interface InventaireRequest {
  dateInventaire: string;
  typeInventaire: TypeInventaire;
  observations?: string;
}

export interface LigneInventaireRequest {
  idGadget: number;
  stockReel: number;
}

export interface JustificationRequest {
  justification: string;
}
