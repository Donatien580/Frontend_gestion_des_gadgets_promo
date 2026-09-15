import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  AffectationDemandeRequest,
  AgentResume,
  Demande,
  DemandeRequest,
  EtatDemande,
  PageResponse,
  RefusDemandeRequest,
} from "../../../core/models";

@Injectable({ providedIn: "root" })
export class DemandeService {
  private baseUrl = `${environment.apiUrl}/demandes`;
  private fichiersUrl = `${environment.apiUrl}/fichiers`;

  constructor(private http: HttpClient) {}

  lister(
    etat: EtatDemande | null,
    recherche: string,
    page: number,
    size: number,
  ): Observable<PageResponse<Demande>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());
    if (etat) params = params.set("etat", etat);
    if (recherche) params = params.set("recherche", recherche);
    return this.http.get<PageResponse<Demande>>(this.baseUrl, { params });
  }

  obtenir(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.baseUrl}/${id}`);
  }

  creer(requete: DemandeRequest): Observable<Demande> {
    return this.http.post<Demande>(this.baseUrl, requete);
  }

  modifier(id: number, requete: DemandeRequest): Observable<Demande> {
    return this.http.put<Demande>(`${this.baseUrl}/${id}`, requete);
  }

  valider(id: number): Observable<Demande> {
    return this.http.patch<Demande>(`${this.baseUrl}/${id}/valider`, {});
  }

  refuser(id: number, requete: RefusDemandeRequest): Observable<Demande> {
    return this.http.patch<Demande>(`${this.baseUrl}/${id}/refuser`, requete);
  }

  annuler(id: number): Observable<Demande> {
    return this.http.patch<Demande>(`${this.baseUrl}/${id}/annuler`, {});
  }

  affecter(
    id: number,
    requete: AffectationDemandeRequest,
  ): Observable<Demande> {
    return this.http.patch<Demande>(`${this.baseUrl}/${id}/affecter`, requete);
  }

  listerAgentsAffectables(): Observable<AgentResume[]> {
    return this.http.get<AgentResume[]>(`${this.baseUrl}/agents-affectables`);
  }

  televerserPieceJustificative(id: number, fichier: File): Observable<Demande> {
    const formData = new FormData();
    formData.append("fichier", fichier);
    return this.http.post<Demande>(
      `${this.baseUrl}/${id}/piece-justificative`,
      formData,
    );
  }

  getPieceUrl(cheminRelatif: string): string {
    return `${this.fichiersUrl}/${cheminRelatif}`;
  }

  suggererNoms(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/suggestions/noms`, {
      params: { prefixe },
    });
  }

  suggererPrenoms(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/suggestions/prenoms`, {
      params: { prefixe },
    });
  }

  suggererServices(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/suggestions/services`, {
      params: { prefixe },
    });
  }

  suggererStructures(prefixe: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/suggestions/structures`, {
      params: { prefixe },
    });
  }
}
