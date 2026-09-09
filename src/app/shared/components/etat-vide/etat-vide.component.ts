import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

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
