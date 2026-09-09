export interface ICategorie {
  idCategorie?: number;
  libelle?: string;
  description?: string;
}

export class Categorie implements ICategorie {
  public idCategorie?: number;
  public libelle?: string;
  public description?: string;
}
