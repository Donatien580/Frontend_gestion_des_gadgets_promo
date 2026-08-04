export interface IdentiteModule {
  id: string;
  libelle: string;
  icone: string;
  couleur: string;
  route: string;
}

/**
 * Ces couleurs sont volontairement indépendantes du thème choisi via
 * ThemeService (--color-primary-*) : elles distinguent les modules entre
 * eux plutôt que de représenter la couleur d'accent générale de l'app.
 */
export const IDENTITES_MODULES: Record<string, IdentiteModule> = {
  catalogue: {
    id: "catalogue",
    libelle: "Catalogue",
    icone: "pi pi-box",
    couleur: "#1f8ef5",
    route: "/catalogue",
  },
  approvisionnements: {
    id: "approvisionnements",
    libelle: "Approvisionnements",
    icone: "pi pi-truck",
    couleur: "#f97316",
    route: "/approvisionnements",
  },
  demandes: {
    id: "demandes",
    libelle: "Demandes",
    icone: "pi pi-inbox",
    couleur: "#8b5cf6",
    route: "/demandes",
  },
  distributions: {
    id: "distributions",
    libelle: "Distributions",
    icone: "pi pi-send",
    couleur: "#10b981",
    route: "/distributions",
  },
  inventaires: {
    id: "inventaires",
    libelle: "Inventaires",
    icone: "pi pi-clipboard",
    couleur: "#ec4899",
    route: "/inventaires",
  },
  rapports: {
    id: "rapports",
    libelle: "Rapports",
    icone: "pi pi-chart-bar",
    couleur: "#0ea5e9",
    route: "/rapports",
  },
  admin: {
    id: "admin",
    libelle: "Administration",
    icone: "pi pi-shield",
    couleur: "#64748b",
    route: "/admin/utilisateurs",
  },
};
