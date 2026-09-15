import { Injectable } from "@angular/core";
import { KeycloakService } from "./keycloak.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  getToken(): string | null {
    return this.keycloak.getToken();
  }

  getRole(): string | null {
    return this.keycloak.getRole();
  }

  getNom(): string | null {
    return this.keycloak.getNom();
  }

  getPrenom(): string | null {
    return this.keycloak.getPrenom();
  }

  getNomComplet(): string | null {
    return this.keycloak.getNomComplet();
  }

  getEmail(): string | null {
    return this.keycloak.getEmail();
  }

  getUserId(): string {
    return this.keycloak.getUserId();
  }

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.keycloak.isAdmin();
  }

  isChefDepartement(): boolean {
    return this.keycloak.isChefDepartement();
  }

  isChefService(): boolean {
    return this.keycloak.isChefService();
  }

  isGestionnaireStock(): boolean {
    return this.keycloak.isGestionnaireStock();
  }

  isAgentSaisie(): boolean {
    return this.keycloak.isAgentSaisie();
  }
}
