import { Incident } from "./incident.model";

export type StatutApprovisionnement = "ENREGISTRE" | "CORRIGE";

export interface GadgetResume {
  idGadget: number;
  libelle: string;
}

export interface LigneApprovisionnement {
  idLigne: number;
  gadget: GadgetResume;
  quantiteCommandee?: number;
  quantiteRecue: number;
  quantiteDefectueuse?: number;
  observationQualite?: string;
  actif?: boolean;
  idLigneRemplacee?: number;
  motifCorrection?: string;
}

export interface Approvisionnement {
  idApprovisionnement: number;
  dateReception: string;
  fournisseur: string;
  adresseFournisseur: String;
  numeroPV?: string;
  numeroMarche?: string;
  statut?: StatutApprovisionnement;
  observations?: string;
  lignes: LigneApprovisionnement[];
  incidents: Incident[];
}

export interface LigneApprovisionnementRequest {
  idGadget: number;
  quantiteCommandee?: number;
  quantiteRecue: number;
  quantiteDefectueuse?: number;
  observationQualite?: string;
}

export interface CreateApprovisionnementRequest {
  dateReception?: string;
  fournisseur: string;
  adresseFournisseur: string;
  numeroPV?: string;
  numeroMarche?: string;
  observations?: string;
  lignes: LigneApprovisionnementRequest[];
}

export interface LigneCorrectionRequest {
  idLigne: number;
  quantiteCommandee?: number;
  quantiteRecue: number;
  quantiteDefectueuse?: number;
  observationQualite?: string;
  motifCorrection: string;
}

export interface CorrectionApprovisionnementRequest {
  lignes: LigneCorrectionRequest[];
}
