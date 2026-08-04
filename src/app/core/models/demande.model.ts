export type TypeDemande = 'INTERNE' | 'EXTERNE';

export type EtatDemande =
  | 'EN_ATTENTE'
  | 'VALIDEE_CHEF_DEPARTEMENT'
  | 'AFFECTEE'
  | 'REFUSEE'
  | 'ANNULEE'
  | 'TRAITEE';

export interface LigneDemande {
  idLigne: number;
  quantiteDemandee: number;
  quantiteAccordee?: number;
  idGadget: number;
  libelleGadget: string;
}

export interface Demande {
  idDemande: number;
  numeroDemande: string;
  objet: string;
  typeDemande: TypeDemande;
  dateDemande: string;
  dateSouhaitee?: string;
  etat: EtatDemande;
  motifRefus?: string;
  lignes: LigneDemande[];
}
