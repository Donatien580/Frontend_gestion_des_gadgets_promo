import { Demande } from "./demande.model";

export interface NiveauStockGadget {
  idGadget: number;
  libelle: string;
  categorie: string;
  quantiteDisponible: number;
}

export interface GadgetAlerte extends NiveauStockGadget {
  niveauAlerte: string;
}

export interface TableauDeBord {
  totalGadgets: number;
  totalCategories: number;
  gadgetsEnAlerteCritique: number;
  gadgetsEnAlerteAvertissement: number;
  demandesEnAttente: number;
  demandesAffectees: number;
  approvisionnementsCeMois: number;
  distributionsCeMois: number;
  gadgetsAlertes: GadgetAlerte[];
  niveauxStockGadgets: NiveauStockGadget[];
  demandesRecentes: Demande[];
}
