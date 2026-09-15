import { Injectable } from "@angular/core";
import Keycloak from "keycloak-js";

@Injectable({ providedIn: "root" })
export class KeycloakService {
  static keycloak: Keycloak | null = null;
  private isBrowser: boolean = true;
  static userInfo: any = null;

  constructor() {}

  getinstance(): Keycloak | null {
    return KeycloakService.keycloak;
  }

  async init(callBack: Function): Promise<boolean> {
    if (!this.isBrowser) {
      console.log("🖥️ Mode SSR, Keycloak non initialisé");
      return false;
    }

    KeycloakService.keycloak = new Keycloak({
      url: "http://localhost:8081",
      realm: "gestock-gadgets",
      clientId: "gadgets-frontend",
    });

    try {
      const authenticated = await KeycloakService.keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
        redirectUri: "http://localhost:4200/admin/dashboard",
      });
      console.log("Connexion réussie", authenticated);
      if (authenticated) {
        this.loadUserInfo();
        this.setupAutoRefresh();
        console.log("✅ Authentifié avec Keycloak");
        callBack();
      }
      return authenticated;
    } catch (error) {
      console.error("❌ Erreur Keycloak:", error);
      return false;
    }
  }

  private loadUserInfo(): void {
    if (!KeycloakService.keycloak?.tokenParsed) return;
    const tokenParsed = KeycloakService.keycloak.tokenParsed;
    const roles = tokenParsed.realm_access?.roles || [];
    const role = roles.find((r: string) => r.startsWith("ROLE_")) || "";

    const fullName = tokenParsed["name"] || "";
    const parts = fullName.split(" ");
    const prenom = tokenParsed["given_name"] || parts[0] || "";
    const nom = tokenParsed["family_name"] || parts.slice(1).join(" ") || "";

    KeycloakService.userInfo = {
      role: role,
      nom: nom,
      prenom: prenom,
      email: tokenParsed["email"] || "",
      userId: tokenParsed.sub || "",
    };
  }

  private setupAutoRefresh(): void {
    if (!KeycloakService.keycloak) return;
    setInterval(() => {
      KeycloakService.keycloak
        ?.updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            this.loadUserInfo();
            console.log("🔄 Token rafraîchi");
          }
        })
        .catch((error) => console.error("❌ Erreur rafraîchissement:", error));
    }, 60000);
  }

  getToken(): string | null {
    return KeycloakService.keycloak?.token || null;
  }

  getRole(): string | null {
    return KeycloakService.userInfo?.role || null;
  }

  getNom(): string | null {
    return KeycloakService.userInfo?.nom || null;
  }

  getPrenom(): string | null {
    return KeycloakService.userInfo?.prenom || null;
  }

  getNomComplet(): string | null {
    if (KeycloakService.userInfo?.prenom && KeycloakService.userInfo?.nom) {
      return `${KeycloakService.userInfo.prenom} ${KeycloakService.userInfo.nom}`;
    }
    return KeycloakService.userInfo?.email || null;
  }

  getEmail(): string | null {
    return KeycloakService.userInfo?.email || null;
  }

  getUserId(): string {
    return KeycloakService.userInfo?.userId || "";
  }

  isLoggedIn(): boolean {
    return KeycloakService.keycloak?.authenticated || false;
  }

  isAdmin(): boolean {
    return this.getRole() === "ROLE_ADMIN";
  }

  isChefDepartement(): boolean {
    return this.getRole() === "ROLE_CHEF_DEPARTEMENT";
  }

  isChefService(): boolean {
    return this.getRole() === "ROLE_CHEF_SERVICE";
  }

  isGestionnaireStock(): boolean {
    return this.getRole() === "ROLE_GESTIONNAIRE_STOCK";
  }

  isAgentSaisie(): boolean {
    return this.getRole() === "ROLE_AGENT_SAISIE";
  }

  logout(): void {
    if (KeycloakService.keycloak) {
      KeycloakService.keycloak.logout({
        redirectUri: "http://localhost:4200/",
      });
    }
    KeycloakService.userInfo = null;
  }

  login(): void {
    KeycloakService.keycloak?.login({
      redirectUri: "http://localhost:4200/admin/dashboard",
    });
  }
}
