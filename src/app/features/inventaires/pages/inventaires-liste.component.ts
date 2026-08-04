import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EtatVideComponent } from "../../../shared/components/etat-vide/etat-vide.component";
import { EnTetePageComponent } from "../../../shared/components/en-tete-page/en-tete-page.component";

@Component({
  selector: "app-inventaires-liste",
  standalone: true,
  imports: [CommonModule, EtatVideComponent, EnTetePageComponent],
  templateUrl: "./inventaires-liste.component.html",
  styleUrl: "./inventaires-liste.component.scss",
})
export class InventairesListeComponent {}
