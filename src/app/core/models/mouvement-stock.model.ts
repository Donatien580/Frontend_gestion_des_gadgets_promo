export type TypeMouvement = 'ENTREE' | 'SORTIE' | 'RETOUR' | 'INVENTAIRE';

export interface MouvementStock {
  idMouvement: number;
  typeMouvement: TypeMouvement;
  quantite: number;
  stockAvant: number;
  stockApres: number;
  motif?: string;
  dateMouvement: string;
  libelleGadget: string;
}
