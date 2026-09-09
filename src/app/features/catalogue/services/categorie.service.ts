import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Categorie } from "../../../core/models";

export interface CategorieRequest {
  libelle: string;
  description?: string;
}

@Injectable({ providedIn: "root" })
export class CategorieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  lister(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseUrl);
  }

  creer(requete: CategorieRequest): Observable<Categorie> {
    return this.http.post<Categorie>(this.baseUrl, requete);
  }

  modifier(id: number, requete: CategorieRequest): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.baseUrl}/${id}`, requete);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
