import { Incident } from "./incident.model";

export interface GadgetResume {
  idGadget: number;
  libelle: string;
}

export interface LigneApprovisionnement {
  idLigne: number;
  gadget: GadgetResume;
  quantiteCommandee?: number;
  quantiteRecue: number;
  //quantiteConforme?: number;
  quantiteDefectueuse?: number;
  observationQualite?: string;
}

export interface Approvisionnement {
  idApprovisionnement: number;
  dateReception: string;
  fournisseur: string;
  numeroPV?: string;
  observations?: string;
  lignes: LigneApprovisionnement[];
  incidents: Incident[];
}

export interface LigneApprovisionnementRequest {
  idGadget: number;
  quantiteCommandee?: number;
  quantiteRecue: number;
  //quantiteConforme?: number;
  quantiteDefectueuse?: number;
  observationQualite?: string;
}

export interface CreateApprovisionnementRequest {
  dateReception?: string;
  fournisseur: string;
  numeroPV?: string;
  observations?: string;
  lignes: LigneApprovisionnementRequest[];
}
