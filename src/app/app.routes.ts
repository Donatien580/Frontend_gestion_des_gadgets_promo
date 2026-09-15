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
        data: { filAriane: [{ libelle: "Catalogue", icone: "pi pi-box" }] },
      },
      {
        path: "catalogue/categories",
        loadComponent: () =>
          import("./features/catalogue/pages/categories-liste.component").then(
            (m) => m.CategoriesListeComponent,
          ),
        title: "Catégories",
        data: {
          filAriane: [
            { libelle: "Catalogue", route: "/catalogue", icone: "pi pi-box" },
            { libelle: "Catégories", icone: "pi pi-tags" },
          ],
        },
      },
      {
        path: "approvisionnements",
        loadComponent: () =>
          import("./features/approvisionnements/pages/approvisionnements-liste.component").then(
            (m) => m.ApprovisionnementsListeComponent,
          ),
        title: "Approvisionnements",
        data: {
          filAriane: [{ libelle: "Approvisionnements", icone: "pi pi-truck" }],
        },
      },
      // {
      //   path: "admin/parametres",
      //   children: [
      //     {
      //       path: "services",
      //       loadComponent: () =>
      //         import("./features/services/page/service-liste.component").then(
      //           (m) => m.ServiceListeComponent,
      //         ),
      //     },
      //     {
      //       path: "personnels",
      //       loadComponent: () =>
      //         import("./features/personnels/page/personnel-liste.component").then(
      //           (m) => m.PersonnelListeComponent,
      //         ),
      //     },
      //   ],
      // },
      {
        path: "demandes",
        loadComponent: () =>
          import("./features/demandes/pages/demandes-liste.component").then(
            (m) => m.DemandesListeComponent,
          ),
        title: "Demandes",
        data: { filAriane: [{ libelle: "Demandes", icone: "pi pi-inbox" }] },
      },
      {
        path: "distributions",
        loadComponent: () =>
          import("./features/distributions/pages/distributions-liste.component").then(
            (m) => m.DistributionListeComponent,
          ),
        title: "Distributions",
        data: {
          filAriane: [{ libelle: "Distributions", icone: "pi pi-send" }],
        },
      },
      {
        path: "inventaires",
        loadComponent: () =>
          import("./features/inventaires/pages/inventaire-liste.component").then(
            (m) => m.InventaireListeComponent,
          ),
        title: "Inventaires",
        data: {
          filAriane: [{ libelle: "Inventaires", icone: "pi pi-clipboard" }],
        },
      },
      {
        path: "rapports",
        loadComponent: () =>
          import("./features/rapports/pages/rapports.component").then(
            (m) => m.RapportsComponent,
          ),
        title: "Rapports",
        data: {
          filAriane: [{ libelle: "Rapports", icone: "pi pi-chart-bar" }],
        },
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
            {
              libelle: "Administration",
              route: "/admin/utilisateurs",
              icone: "pi pi-shield",
            },
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
            {
              libelle: "Administration",
              route: "/admin/utilisateurs",
              icone: "pi pi-shield",
            },
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
          filAriane: [
            {
              libelle: "Administration",
              route: "/admin/utilisateurs",
              icone: "pi pi-shield",
            },
            { libelle: "Paramètres" },
          ],
        },
      },
      { path: "**", redirectTo: "tableau-de-bord" },
    ],
  },
];
