export type TypeDistribution = "INTERNE" | "EXTERNE";

export type EtatDistribution =
  | "EN_ATTENTE"
  | "EXECUTEE"
  | "BORDEREAU_GENERE"
  | "SIGNEE"
  | "ANNULEE";

export interface LigneDistribution {
  idLigne: number;
  idGadget: number;
  libelleGadget: string;
  quantiteDistribuee: number;
}

export interface Distribution {
  idDistribution: number;
  numeroBordereau: string;
  dateDistribution: string | Date;
  typeDistribution: TypeDistribution;
  motif: string;
  destinataire: string;
  etat: EtatDistribution;
  dateGenerationBordereau?: string | Date;
  dateSignature?: string | Date;
  signePar?: string;
  idDemande: number;
  numeroDemande: string;
  objetDemande: string;
  lignes: LigneDistribution[];
}

export interface DistributionRequest {
  idDemande: number;
  dateDistribution?: string;
  motif?: string;
  destinataire?: string;
}

// export interface PageResponse<T> {
//   content: T[];
//   page: number;
//   size: number;
//   totalElements: number;
//   totalPages: number;
// }
