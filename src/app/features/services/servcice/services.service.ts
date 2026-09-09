import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Services, ServiceRequest } from "../../../core/models/service.model";

@Injectable({ providedIn: "root" })
export class ServicesService {
  private baseUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  lister(): Observable<Services[]> {
    return this.http.get<Services[]>(this.baseUrl);
  }

  obtenir(id: number): Observable<Services> {
    return this.http.get<Services>(`${this.baseUrl}/${id}`);
  }

  creer(requete: ServiceRequest): Observable<Services> {
    return this.http.post<Services>(this.baseUrl, requete);
  }

  modifier(id: number, requete: ServiceRequest): Observable<Services> {
    return this.http.put<Services>(`${this.baseUrl}/${id}`, requete);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
