import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Gadget,
  CreateGadgetRequest,
  PageResponse,
} from "../../../core/models";

export interface OptionsListeGadgets {
  page: number;
  taille: number;
  idCategorie?: number | null;
  recherche?: string;
  tri?: string;
  inclureInactifs?: boolean;
}
@Injectable({ providedIn: "root" })
export class GadgetService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/gadgets`;

  lister(options: OptionsListeGadgets): Observable<PageResponse<Gadget>> {
    let params = new HttpParams()
      .set("page", options.page)
      .set("size", options.taille)
      .set("sort", options.tri ?? "libelle,asc");

    if (options.idCategorie) {
      params = params.set("idCategorie", options.idCategorie);
    }
    if (options.recherche) {
      params = params.set("recherche", options.recherche);
    }
    if (options.inclureInactifs) {
      params = params.set("inclureInactifs", true);
    }

    return this.http.get<PageResponse<Gadget>>(this.baseUrl, { params });
  }

  obtenir(id: number): Observable<Gadget> {
    return this.http.get<Gadget>(`${this.baseUrl}/${id}`);
  }

  listerSousSeuilAlerte(): Observable<Gadget[]> {
    return this.http.get<Gadget[]>(`${this.baseUrl}/alertes-stock`);
  }

  creer(requete: CreateGadgetRequest): Observable<Gadget> {
    return this.http.post<Gadget>(this.baseUrl, requete);
  }

  modifier(id: number, requete: CreateGadgetRequest): Observable<Gadget> {
    return this.http.put<Gadget>(`${this.baseUrl}/${id}`, requete);
  }

  changerStatut(id: number, actif: boolean): Observable<Gadget> {
    return this.http.patch<Gadget>(`${this.baseUrl}/${id}/statut`, { actif });
  }

  televerserPhoto(id: number, fichier: File): Observable<Gadget> {
    const formData = new FormData();
    formData.append("fichier", fichier);
    return this.http.post<Gadget>(`${this.baseUrl}/${id}/photo`, formData);
  }
}
