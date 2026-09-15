import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { TableauDeBord } from "../../../core/models/tableau-de-bord.model";

@Injectable({ providedIn: "root" })
export class TableauDeBordService {
  private baseUrl = `${environment.apiUrl}/tableau-de-bord`;

  constructor(private http: HttpClient) {}

  obtenir(): Observable<TableauDeBord> {
    return this.http.get<TableauDeBord>(this.baseUrl);
  }
}
