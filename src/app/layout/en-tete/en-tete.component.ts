import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelecteurThemeComponent } from "../../shared/components/selecteur-theme/selecteur-theme.component";
import { AuthService } from "../../core/services/auth.service";

const LIBELLES_ROLES: Record<string, string> = {
  ROLE_ADMIN: "Administrateur",
  ROLE_CHEF_DEPARTEMENT: "Chef de département",
  ROLE_CHEF_SERVICE: "Chef de service",
  ROLE_GESTIONNAIRE_STOCK: "Gestionnaire de stock",
  ROLE_AGENT_SAISIE: "Agent de saisie",
};

@Component({
  selector: "app-en-tete",
  standalone: true,
  imports: [CommonModule, SelecteurThemeComponent],
  templateUrl: "./en-tete.component.html",
  styleUrl: "./en-tete.component.scss",
})
export class EnTeteComponent {
  constructor(private authService: AuthService) {}

  get nomComplet(): string {
    return this.authService.getNomComplet() || "Utilisateur";
  }

  get libelleRole(): string {
    const role = this.authService.getRole();
    return role ? LIBELLES_ROLES[role] || role : "";
  }

  get initiales(): string {
    const prenom = this.authService.getPrenom() || "";
    const nom = this.authService.getNom() || "";
    const initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
    return initiales || "?";
  }

  seDeconnecter(): void {
    this.authService.logout();
  }
}
