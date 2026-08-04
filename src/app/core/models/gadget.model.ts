import { Categorie } from './categorie.model';

export type EtatGadget = 'DISPONIBLE' | 'MANQUANT' | 'ENDOMMAGE';

export interface Gadget {
  idGadget: number;
  libelle: string;
  designation?: string;
  description?: string;
  seuilAlerte: number;
  photoGadget?: string;
  quantiteDisponible: number;
  etat: EtatGadget;
  actif: boolean;
  categorie: Categorie;
}

export interface CreateGadgetRequest {
  libelle: string;
  designation?: string;
  description?: string;
  seuilAlerte: number;
  idCategorie: number;
}
