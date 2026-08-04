import { RoleType } from './role.model';

export interface Utilisateur {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  role: RoleType;
}
