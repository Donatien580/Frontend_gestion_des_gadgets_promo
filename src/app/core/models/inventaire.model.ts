export type TypeInventaire = 'TRIMESTRIEL' | 'EXCEPTIONNEL';
export type EtatInventaire = 'EN_COURS' | 'TERMINE' | 'VALIDE';

export interface LigneInventaire {
  idLigne: number;
  stockTheorique: number;
  stockReel: number;
  ecart: number;
  justification?: string;
  validationJustif: boolean;
  idGadget: number;
  libelleGadget: string;
}

export interface Inventaire {
  idInventaire: number;
  dateInventaire: string;
  typeInventaire: TypeInventaire;
  etat: EtatInventaire;
  lignes: LigneInventaire[];
}
