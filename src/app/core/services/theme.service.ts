import { Injectable, signal } from "@angular/core";

export interface OptionTheme {
  id: string;
  libelle: string;
  couleurApercu: string;
}

const CLE_STOCKAGE = "gadgets-theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
  readonly themes: OptionTheme[] = [
    { id: "bleu", libelle: "Bleu ciel", couleurApercu: "#1f8ef5" },
    { id: "violet", libelle: "Violet", couleurApercu: "#7c5cfc" },
    { id: "emeraude", libelle: "Émeraude", couleurApercu: "#10b981" },
    { id: "corail", libelle: "Corail", couleurApercu: "#ff6b4a" },
  ];

  readonly themeActuel = signal<string>(this.lireThemeStocke());

  constructor() {
    this.appliquer(this.themeActuel());
  }

  definirTheme(id: string): void {
    this.themeActuel.set(id);
    this.appliquer(id);
    localStorage.setItem(CLE_STOCKAGE, id);
  }

  private appliquer(id: string): void {
    document.documentElement.setAttribute("data-theme", id);
  }

  private lireThemeStocke(): string {
    return localStorage.getItem(CLE_STOCKAGE) ?? "bleu";
  }
}
