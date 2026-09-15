import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Approvisionnement,
  CreateApprovisionnementRequest,
  PageResponse,
  CorrectionApprovisionnementRequest,
} from "../../../core/models";

export interface OptionsListeApprovisionnements {
  page: number;
  taille: number;
  recherche?: string;
}

@Injectable({ providedIn: "root" })
export class ApprovisionnementService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/approvisionnements`;

  lister(
    options: OptionsListeApprovisionnements,
  ): Observable<PageResponse<Approvisionnement>> {
    let params = new HttpParams()
      .set("page", options.page)
      .set("size", options.taille);
    if (options.recherche) {
      params = params.set("recherche", options.recherche);
    }
    return this.http.get<PageResponse<Approvisionnement>>(this.baseUrl, {
      params,
    });
  }

  obtenir(id: number): Observable<Approvisionnement> {
    return this.http.get<Approvisionnement>(`${this.baseUrl}/${id}`);
  }

  creer(
    requete: CreateApprovisionnementRequest,
  ): Observable<Approvisionnement> {
    return this.http.post<Approvisionnement>(this.baseUrl, requete);
  }

  corriger(
    id: number,
    requete: CorrectionApprovisionnementRequest,
  ): Observable<Approvisionnement> {
    return this.http.patch<Approvisionnement>(
      `${this.baseUrl}/${id}/corriger`,
      requete,
    );
  }

  suggererFournisseurs(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/suggestions/fournisseurs`, {
      params: { prefixe },
    });
  }
}
