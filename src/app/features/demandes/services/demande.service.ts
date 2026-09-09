// // import { Injectable } from "@angular/core";
// // import { HttpClient, HttpParams } from "@angular/common/http";
// // import { Observable } from "rxjs";
// // import { environment } from "../../../../environments/environment";
// // import { Demande, DemandeRequest, EtatDemande } from "../../../core/models";

// // @Injectable({
// //   providedIn: "root",
// // })
// // export class DemandeService {
// //   private baseUrl = `${environment.apiUrl}/demandes`;
// //   private fichiersUrl = `${environment.apiUrl}/fichiers`;

// //   constructor(private http: HttpClient) {}

// //   // Liste des demandes (filtres optionnels)
// //   lister(etat?: EtatDemande | null, recherche?: string): Observable<Demande[]> {
// //     let params = new HttpParams();
// //     if (etat) params = params.set("etat", etat);
// //     if (recherche) params = params.set("recherche", recherche);
// //     return this.http.get<Demande[]>(this.baseUrl, { params });
// //   }

// //   // Obtenir une demande par id
// //   obtenir(id: number): Observable<Demande> {
// //     return this.http.get<Demande>(`${this.baseUrl}/${id}`);
// //   }

// //   // Créer une demande
// //   creer(requete: DemandeRequest): Observable<Demande> {
// //     return this.http.post<Demande>(this.baseUrl, requete);
// //   }

// //   // Modifier une demande existante (uniquement si EN_ATTENTE)
// //   modifier(id: number, requete: DemandeRequest): Observable<Demande> {
// //     return this.http.put<Demande>(`${this.baseUrl}/${id}`, requete);
// //   }

// //   // Valider une demande (Chef Département)
// //   valider(id: number): Observable<Demande> {
// //     return this.http.put<Demande>(`${this.baseUrl}/${id}/valider`, {});
// //   }

// //   // Refuser une demande
// //   refuser(id: number, motif: string): Observable<Demande> {
// //     const params = new HttpParams().set("motif", motif);
// //     return this.http.put<Demande>(`${this.baseUrl}/${id}/refuser`, null, {
// //       params,
// //     });
// //   }

// //   // Annuler une demande
// //   annuler(id: number): Observable<Demande> {
// //     return this.http.put<Demande>(`${this.baseUrl}/${id}/annuler`, {});
// //   }

// //   // Affecter un agent (Chef Département)
// //   affecter(id: number, idAgent: number): Observable<Demande> {
// //     return this.http.put<Demande>(
// //       `${this.baseUrl}/${id}/affecter/${idAgent}`,
// //       {},
// //     );
// //   }

// //   // Traiter une demande (Chef Service)
// //   traiter(
// //     id: number,
// //     decision: "ACCEPTER" | "REFUSER",
// //     motifRefus?: string,
// //   ): Observable<Demande> {
// //     let params = new HttpParams().set("decision", decision);
// //     if (motifRefus) {
// //       params = params.set("motifRefus", motifRefus);
// //     }
// //     return this.http.put<Demande>(`${this.baseUrl}/${id}/traiter`, null, {
// //       params,
// //     });
// //   }

// //   // Uploader une pièce justificative
// //   televerserPieceJustificative(id: number, fichier: File): Observable<Demande> {
// //     const formData = new FormData();
// //     formData.append("fichier", fichier);
// //     return this.http.post<Demande>(
// //       `${this.baseUrl}/${id}/piece-justificative`,
// //       formData,
// //     );
// //   }

// //   // Construire l'URL d'affichage d'un fichier
// //   getPieceUrl(cheminRelatif: string): string {
// //     return `${this.fichiersUrl}/${cheminRelatif}`;
// //   }
// // }

// import { Injectable } from "@angular/core";
// import { HttpClient, HttpParams } from "@angular/common/http";
// import { Observable } from "rxjs";
// import { environment } from "../../../../environments/environment";
// import {
//   Demande,
//   DemandeRequest,
//   EtatDemande,
//   PageResponse,
// } from "../../../core/models";

// @Injectable({ providedIn: "root" })
// export class DemandeService {
//   private baseUrl = `${environment.apiUrl}/demandes`;
//   private fichiersUrl = `${environment.apiUrl}/fichiers`;

//   constructor(private http: HttpClient) {}

//   lister(
//     etat: EtatDemande | null,
//     recherche: string,
//     page: number,
//     size: number,
//   ): Observable<PageResponse<Demande>> {
//     let params = new HttpParams()
//       .set("page", page.toString())
//       .set("size", size.toString());
//     if (etat) params = params.set("etat", etat);
//     if (recherche) params = params.set("recherche", recherche);
//     return this.http.get<PageResponse<Demande>>(this.baseUrl, { params });
//   }

//   obtenir(id: number): Observable<Demande> {
//     return this.http.get<Demande>(`${this.baseUrl}/${id}`);
//   }

//   creer(requete: DemandeRequest): Observable<Demande> {
//     return this.http.post<Demande>(this.baseUrl, requete);
//   }

//   modifier(id: number, requete: DemandeRequest): Observable<Demande> {
//     return this.http.put<Demande>(`${this.baseUrl}/${id}`, requete);
//   }

//   valider(id: number): Observable<Demande> {
//     return this.http.put<Demande>(`${this.baseUrl}/${id}/valider`, {});
//   }

//   refuser(id: number, motif: string): Observable<Demande> {
//     const params = new HttpParams().set("motif", motif);
//     return this.http.put<Demande>(`${this.baseUrl}/${id}/refuser`, null, {
//       params,
//     });
//   }

//   annuler(id: number): Observable<Demande> {
//     return this.http.put<Demande>(`${this.baseUrl}/${id}/annuler`, {});
//   }

//   affecter(id: number, idAgent: number): Observable<Demande> {
//     return this.http.put<Demande>(
//       `${this.baseUrl}/${id}/affecter/${idAgent}`,
//       {},
//     );
//   }

//   traiter(
//     id: number,
//     decision: "ACCEPTER" | "REFUSER",
//     motifRefus?: string,
//   ): Observable<Demande> {
//     let params = new HttpParams().set("decision", decision);
//     if (motifRefus) params = params.set("motifRefus", motifRefus);
//     return this.http.put<Demande>(`${this.baseUrl}/${id}/traiter`, null, {
//       params,
//     });
//   }

//   televerserPieceJustificative(id: number, fichier: File): Observable<Demande> {
//     const formData = new FormData();
//     formData.append("fichier", fichier);
//     return this.http.post<Demande>(
//       `${this.baseUrl}/${id}/piece-justificative`,
//       formData,
//     );
//   }

//   getPieceUrl(cheminRelatif: string): string {
//     return `${this.fichiersUrl}/${cheminRelatif}`;
//   }
// }

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Demande,
  DemandeRequest,
  EtatDemande,
  PageResponse,
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
    return this.http.put<Demande>(`${this.baseUrl}/${id}/valider`, {});
  }

  refuser(id: number, motif: string): Observable<Demande> {
    const params = new HttpParams().set("motif", motif);
    return this.http.put<Demande>(`${this.baseUrl}/${id}/refuser`, null, {
      params,
    });
  }

  annuler(id: number): Observable<Demande> {
    return this.http.put<Demande>(`${this.baseUrl}/${id}/annuler`, {});
  }

  // Affectation sans idAgent (automatique)
  affecter(id: number): Observable<Demande> {
    return this.http.put<Demande>(`${this.baseUrl}/${id}/affecter`, {});
  }

  traiter(
    id: number,
    decision: "ACCEPTER" | "REFUSER",
    motifRefus?: string,
  ): Observable<Demande> {
    let params = new HttpParams().set("decision", decision);
    if (motifRefus) params = params.set("motifRefus", motifRefus);
    return this.http.put<Demande>(`${this.baseUrl}/${id}/traiter`, null, {
      params,
    });
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
}
