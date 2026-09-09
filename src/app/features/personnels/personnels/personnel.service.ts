// personnel.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  Personnel,
  PersonnelRequest,
} from "../../../core/models/personnel.model";

@Injectable({ providedIn: "root" })
export class PersonnelService {
  private baseUrl = `${environment.apiUrl}/personnels`;

  constructor(private http: HttpClient) {}

  lister(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.baseUrl);
  }

  obtenir(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.baseUrl}/${id}`);
  }

  creer(requete: PersonnelRequest): Observable<Personnel> {
    return this.http.post<Personnel>(this.baseUrl, requete);
  }

  modifier(id: number, requete: PersonnelRequest): Observable<Personnel> {
    return this.http.put<Personnel>(`${this.baseUrl}/${id}`, requete);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
