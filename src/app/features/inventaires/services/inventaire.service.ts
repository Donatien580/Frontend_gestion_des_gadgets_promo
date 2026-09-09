import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Inventaire,
  InventaireRequest,
  JustificationRequest,
  LigneInventaireRequest,
  PageResponse,
} from "../../../core/models";

@Injectable({
  providedIn: "root",
})
export class InventaireService {
  private readonly baseUrl = `${environment.apiUrl}/inventaires`;

  constructor(private http: HttpClient) {}

  lister(options: {
    page: number;
    taille: number;
    recherche?: string;
  }): Observable<PageResponse<Inventaire>> {
    let params = new HttpParams()
      .set("page", options.page)
      .set("size", options.taille);

    if (options.recherche) {
      params = params.set("recherche", options.recherche);
    }

    return this.http.get<PageResponse<Inventaire>>(this.baseUrl, { params });
  }

  obtenirParId(idInventaire: number): Observable<Inventaire> {
    return this.http.get<Inventaire>(`${this.baseUrl}/${idInventaire}`);
  }

  creer(donnees: InventaireRequest): Observable<Inventaire> {
    return this.http.post<Inventaire>(this.baseUrl, donnees);
  }

  saisirLigne(
    idInventaire: number,
    donnees: LigneInventaireRequest,
  ): Observable<Inventaire> {
    return this.http.post<Inventaire>(
      `${this.baseUrl}/${idInventaire}/lignes`,
      donnees,
    );
  }

  justifierEcart(
    idInventaire: number,
    idLigne: number,
    donnees: JustificationRequest,
  ): Observable<Inventaire> {
    return this.http.patch<Inventaire>(
      `${this.baseUrl}/${idInventaire}/lignes/${idLigne}/justification`,
      donnees,
    );
  }

  terminer(idInventaire: number): Observable<Inventaire> {
    return this.http.patch<Inventaire>(
      `${this.baseUrl}/${idInventaire}/terminer`,
      {},
    );
  }

  valider(idInventaire: number): Observable<Inventaire> {
    return this.http.patch<Inventaire>(
      `${this.baseUrl}/${idInventaire}/valider`,
      {},
    );
  }
}
