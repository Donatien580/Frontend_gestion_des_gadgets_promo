import { Routes } from "@angular/router";
import { StructureComponent } from "./layout/structure/structure.component";

export const routes: Routes = [
  {
    path: "",
    component: StructureComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "tableau-de-bord" },
      {
        path: "tableau-de-bord",
        loadComponent: () =>
          import("./features/tableau-de-bord/pages/tableau-de-bord.component").then(
            (m) => m.TableauDeBordComponent,
          ),
        title: "Tableau de bord",
        data: { filAriane: [{ libelle: "Tableau de bord" }] },
      },
      {
        path: "catalogue",
        loadComponent: () =>
          import("./features/catalogue/pages/catalogue-liste.component").then(
            (m) => m.CatalogueListeComponent,
          ),
        title: "Catalogue des gadgets",
        data: { filAriane: [{ libelle: "Catalogue" }] },
      },
      {
        path: "approvisionnements",
        loadComponent: () =>
          import("./features/approvisionnements/pages/approvisionnements-liste.component").then(
            (m) => m.ApprovisionnementsListeComponent,
          ),
        title: "Approvisionnements",
        data: { filAriane: [{ libelle: "Approvisionnements" }] },
      },
      {
        path: "demandes",
        loadComponent: () =>
          import("./features/demandes/pages/demandes-liste.component").then(
            (m) => m.DemandesListeComponent,
          ),
        title: "Demandes",
        data: { filAriane: [{ libelle: "Demandes" }] },
      },
      {
        path: "distributions",
        loadComponent: () =>
          import("./features/distributions/pages/distributions-liste.component").then(
            (m) => m.DistributionsListeComponent,
          ),
        title: "Distributions",
        data: { filAriane: [{ libelle: "Distributions" }] },
      },
      {
        path: "inventaires",
        loadComponent: () =>
          import("./features/inventaires/pages/inventaires-liste.component").then(
            (m) => m.InventairesListeComponent,
          ),
        title: "Inventaires",
        data: { filAriane: [{ libelle: "Inventaires" }] },
      },
      {
        path: "rapports",
        loadComponent: () =>
          import("./features/rapports/pages/rapports.component").then(
            (m) => m.RapportsComponent,
          ),
        title: "Rapports",
        data: { filAriane: [{ libelle: "Rapports" }] },
      },
      {
        path: "admin/utilisateurs",
        loadComponent: () =>
          import("./features/admin/pages/utilisateurs-liste.component").then(
            (m) => m.UtilisateursListeComponent,
          ),
        title: "Utilisateurs",
        data: {
          filAriane: [
            { libelle: "Administration" },
            { libelle: "Utilisateurs" },
          ],
        },
      },
      {
        path: "admin/roles",
        loadComponent: () =>
          import("./features/admin/pages/roles-liste.component").then(
            (m) => m.RolesListeComponent,
          ),
        title: "Rôles & permissions",
        data: {
          filAriane: [
            { libelle: "Administration" },
            { libelle: "Rôles & permissions" },
          ],
        },
      },
      {
        path: "admin/parametres",
        loadComponent: () =>
          import("./features/admin/pages/parametres.component").then(
            (m) => m.ParametresComponent,
          ),
        title: "Paramètres",
        data: {
          filAriane: [{ libelle: "Administration" }, { libelle: "Paramètres" }],
        },
      },
      { path: "**", redirectTo: "tableau-de-bord" },
    ],
  },
];
