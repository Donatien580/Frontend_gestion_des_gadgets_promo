import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Distribution,
  DistributionRequest,
  PageResponse,
} from "../../../core/models";

@Injectable({ providedIn: "root" })
export class DistributionService {
  private baseUrl = `${environment.apiUrl}/distributions`;

  constructor(private http: HttpClient) {}

  lister(page: number, size: number): Observable<PageResponse<Distribution>> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());
    return this.http.get<PageResponse<Distribution>>(this.baseUrl, { params });
  }

  obtenir(id: number): Observable<Distribution> {
    return this.http.get<Distribution>(`${this.baseUrl}/${id}`);
  }

  creer(requete: DistributionRequest): Observable<Distribution> {
    return this.http.post<Distribution>(this.baseUrl, requete);
  }

  executer(id: number): Observable<Distribution> {
    return this.http.patch<Distribution>(`${this.baseUrl}/${id}/executer`, {});
  }

  genererBordereauPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/bordereau-pdf`, {
      responseType: "blob",
    });
  }

  suggererNomsReceptionnaire(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/suggestions/noms-receptionnaire`,
      { params: { prefixe } },
    );
  }

  suggererPrenomsReceptionnaire(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/suggestions/prenoms-receptionnaire`,
      { params: { prefixe } },
    );
  }

  suggererServicesReceptionnaire(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/suggestions/services-receptionnaire`,
      { params: { prefixe } },
    );
  }

  suggererDestinataires(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/suggestions/destinataires`,
      { params: { prefixe } },
    );
  }
}
