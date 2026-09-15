export type TypeDemande = "INTERNE" | "EXTERNE";

export type EtatDemande =
  | "EN_ATTENTE"
  | "VALIDEE_CHEF_DEPARTEMENT"
  | "AFFECTEE"
  | "REFUSEE"
  | "ANNULEE"
  | "TRAITEE";

export interface AgentResume {
  idUtilisateur: number;
  nom: string;
  prenom: string;
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
  dateTraitement?: string | Date;
  etat: EtatDemande;
  motifRefus?: string;
  observations?: string;

  nomDemandeur: string;
  prenomDemandeur?: string;
  telephoneDemandeur?: string;

  // Interne
  matriculeDemandeur?: string;
  serviceDemandeur?: string;

  // Externe
  structureDemandeur?: string;

  agentSaisie?: AgentResume;
  agentAffecte?: AgentResume;

  pieceJustificative?: PieceJustificative | null;
}

export interface DemandeRequest {
  objet: string;
  typeDemande: TypeDemande;
  dateSouhaitee?: string;
  observations?: string;

  nomDemandeur: string;
  prenomDemandeur?: string;
  telephoneDemandeur?: string;

  // Interne
  matriculeDemandeur?: string;
  serviceDemandeur?: string;

  // Externe
  structureDemandeur?: string;
}

export interface AffectationDemandeRequest {
  idAgentAffecte: number;
}

export interface RefusDemandeRequest {
  motifRefus: string;
}
