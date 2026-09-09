export interface Personnel {
  idPersonnel: number;
  nom: string;
  prenom: string;
  matricule: string;
  telephone: string;
  fonction: string;
  actif: boolean;
  idService: number;
  libelleService?: string;
}

export interface PersonnelRequest {
  nom: string;
  prenom?: string;
  matricule?: string;
  telephone?: string;
  fonction?: string;
  actif?: boolean;
  idService: number;
}
