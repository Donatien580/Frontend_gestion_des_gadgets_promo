import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * État vide partagé
 * Utilisé par toutes les listes (catalogue, demandes, distributions...) tant
 * qu'elles ne sont pas encore connectées au backend ou n'ont aucune donnée.
 */
@Component({
  selector: "app-etat-vide",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./etat-vide.component.html",
  styleUrl: "./etat-vide.component.scss",
})
export class EtatVideComponent {
  @Input() icone = "pi pi-inbox";
  @Input({ required: true }) titre!: string;
  @Input() message = "";
  @Input() libelleAction = "";
}
