export type TypeIncident = 'QUANTITE_MANQUANTE' | 'MAUVAIS_ETAT';
export type StatutIncident = 'EN_COURS' | 'RESOLU';

export interface Incident {
  idIncident: number;
  typeIncident: TypeIncident;
  description?: string;
  dateSignalement: string;
  statut: StatutIncident;
}
