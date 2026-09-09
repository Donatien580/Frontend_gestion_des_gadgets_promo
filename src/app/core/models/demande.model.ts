// // Type de demande
// export type TypeDemande = "INTERNE" | "EXTERNE";

// // États possibles
// export type EtatDemande =
//   | "EN_ATTENTE"
//   | "VALIDEE_CHEF_DEPARTEMENT"
//   | "AFFECTEE"
//   | "REFUSEE"
//   | "ANNULEE"
//   | "TRAITEE";

// // Ligne de demande
// export interface LigneDemande {
//   idLigne: number;
//   idGadget: number;
//   libelleGadget: string;
//   quantiteDemandee: number;
//   quantiteAccordee?: number;
// }

// // Ligne de demande pour la création/modification
// export interface LigneDemandeRequest {
//   idGadget: number;
//   quantiteDemandee: number;
// }

// // Pièce justificative
// export interface PieceJustificative {
//   nomFichier: string;
//   typeFichier: string;
//   cheminFichier: string;
// }

// // Demande (réponse backend)
// export interface Demande {
//   idDemande: number;
//   numeroDemande: string;
//   objet: string;
//   typeDemande: TypeDemande;
//   dateDemande: string | number[] | Date;
//   dateSouhaitee?: string | Date;
//   dateValidation?: string | Date;
//   etat: EtatDemande;
//   motifRefus?: string;
//   observations?: string;

//   // Interne
//   service?: string;
//   matriculeResponsable?: string;
//   nomResponsable?: string;

//   // Externe
//   structure?: string;
//   representant?: string;
//   telephone?: string;

//   // Agent affecté
//   idAgentAffecte?: number;
//   nomAgentAffecte?: string;

//   // Pièce justificative
//   pieceJustificative?: PieceJustificative | null;

//   lignes: LigneDemande[];
// }

// // Payload pour créer/modifier une demande
// export interface DemandeRequest {
//   objet: string;
//   typeDemande: TypeDemande;
//   dateSouhaitee?: string;
//   observations?: string;

//   // Interne
//   service?: string;
//   matriculeResponsable?: string;
//   nomResponsable?: string;

//   // Externe
//   structure?: string;
//   representant?: string;
//   telephone?: string;

//   lignes: LigneDemandeRequest[];
// }

export type TypeDemande = "INTERNE" | "EXTERNE";

export type EtatDemande =
  | "EN_ATTENTE"
  | "VALIDEE_CHEF_DEPARTEMENT"
  | "AFFECTEE"
  | "REFUSEE"
  | "ANNULEE"
  | "TRAITEE";

export interface LigneDemande {
  idLigne: number;
  idGadget: number;
  libelleGadget: string;
  quantiteDemandee: number;
  quantiteAccordee?: number;
}

export interface PieceJustificative {
  nomFichier: string;
  typeFichier: string;
  cheminFichier: string;
}

export interface Demande {
  idDemande: number;
  numeroDemande: string;
  objet: string;
  typeDemande: TypeDemande;
  dateDemande: string | Date;
  dateSouhaitee?: string | Date;
  dateValidation?: string | Date;
  etat: EtatDemande;
  motifRefus?: string;
  observations?: string;

  // Interne
  idService?: number;
  libelleService?: string;
  matriculeResponsable?: string;
  nomResponsable?: string;
  nombrePersonnelsImpactes?: number;

  // Externe
  structure?: string;
  representant?: string;
  telephone?: string;

  idAgentAffecte?: number;
  nomAgentAffecte?: string;

  pieceJustificative?: PieceJustificative | null;

  lignes: LigneDemande[];
}

export interface DemandeRequest {
  objet: string;
  typeDemande: TypeDemande;
  dateSouhaitee?: string;
  observations?: string;
  // Interne
  idService?: number;
  nombrePersonnelsImpactes?: number;
  // Externe
  structure?: string;
  representant?: string;
  telephone?: string;
  lignes: LigneDemandeRequest[];
}

export interface LigneDemandeRequest {
  idGadget: number;
  quantiteDemandee: number;
}

// export interface PageResponse<T> {
//   content: T[];
//   page: number;
//   size: number;
//   totalElements: number;
//   totalPages: number;
// }
