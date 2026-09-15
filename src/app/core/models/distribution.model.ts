export type TypeDistribution = "INTERNE" | "EXTERNE";

export type EtatDistribution =
  | "EN_ATTENTE"
  | "EXECUTEE"
  | "BORDEREAU_GENERE"
  | "ANNULEE";

export interface LigneDistribution {
  idLigne: number;
  idGadget: number;
  libelleGadget: string;
  quantiteDistribuee: number;
}

export interface LigneDistributionRequest {
  idGadget: number;
  quantiteDistribuee: number;
}

export interface Distribution {
  idDistribution: number;
  numeroBordereau: string;
  dateDistribution: string | Date;
  typeDistribution: TypeDistribution;
  estDotation: boolean;
  motif?: string;
  destinataire?: string;
  matriculeReceptionnaire?: string;
  nomReceptionnaire?: string;
  prenomReceptionnaire?: string;
  serviceReceptionnaire?: string;
  nombrePersonnes?: number;
  etat: EtatDistribution;
  dateGenerationBordereau?: string | Date;
  idDemande?: number;
  numeroDemande?: string;
  objetDemande?: string;
  lignes: LigneDistribution[];
}

export interface DistributionRequest {
  idDemande?: number;
  typeDistribution?: TypeDistribution; // requis seulement si idDemande est absent (dotation)
  dateDistribution?: string;
  motif?: string;
  destinataire?: string;
  matriculeReceptionnaire?: string;
  nomReceptionnaire?: string;
  prenomReceptionnaire?: string;
  serviceReceptionnaire?: string;
  nombrePersonnes?: number;
  lignes: LigneDistributionRequest[];
}
