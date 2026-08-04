import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelecteurThemeComponent } from "../../shared/components/selecteur-theme/selecteur-theme.component";

@Component({
  selector: "app-en-tete",
  standalone: true,
  imports: [CommonModule, SelecteurThemeComponent],
  templateUrl: "./en-tete.component.html",
  styleUrl: "./en-tete.component.scss",
})
export class EnTeteComponent {
  // Placeholder tant que Keycloak n'est pas intégré
  protected readonly utilisateurCourant = {
    nomComplet: "Utilisateur de démonstration",
    role: "Gestionnaire de Stock",
    initiales: "UD",
  };
}
