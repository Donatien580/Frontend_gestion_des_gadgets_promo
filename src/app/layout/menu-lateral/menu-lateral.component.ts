import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

interface ElementMenu {
  libelle: string;
  icone: string;
  route?: string;
  enfants?: ElementMenu[];
  ouvert?: boolean;
}

interface GroupeMenu {
  titre: string | null;
  elements: ElementMenu[];
}

@Component({
  selector: "app-menu-lateral",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./menu-lateral.component.html",
  styleUrl: "./menu-lateral.component.scss",
})
export class MenuLateralComponent {
  protected reduit = false;

  protected readonly groupesMenu: GroupeMenu[] = [
    {
      titre: null,

      elements: [
        {
          libelle: "Tableau de bord",
          icone: "pi pi-th-large",
          route: "/tableau-de-bord",
        },
      ],
    },

    {
      titre: "Gestion",

      elements: [
        // {
        //   libelle: "Catalogue",
        //   icone: "pi pi-box",
        //   route: "/catalogue",
        // },
        {
          libelle: "Approvisionnements",
          icone: "pi pi-truck",
          route: "/approvisionnements",
        },
        {
          libelle: "Demandes",
          icone: "pi pi-inbox",
          route: "/demandes",
        },
        {
          libelle: "Distributions",
          icone: "pi pi-send",
          route: "/distributions",
        },
        {
          libelle: "Inventaires",
          icone: "pi pi-clipboard",
          route: "/inventaires",
        },
      ],
    },

    {
      titre: "Pilotage",

      elements: [
        {
          libelle: "Rapports",
          icone: "pi pi-file",
          route: "/rapports",
        },
        {
          libelle: "Statistiques",
          icone: "pi pi-chart-bar",
          route: "/statistiques",
        },
      ],
    },

    {
      titre: "Administration",

      elements: [
        {
          libelle: "Utilisateurs",
          icone: "pi pi-users",
          route: "/admin/utilisateurs",
        },

        {
          libelle: "Rôles & permissions",
          icone: "pi pi-shield",
          route: "/admin/roles",
        },

        {
          libelle: "Paramètres",
          icone: "pi pi-cog",
          ouvert: false,

          enfants: [
            {
              libelle: "Catégories",
              icone: "pi pi-tags",
              route: "/catalogue/categories",
            },
            {
              libelle: "Catalogue",
              icone: "pi pi-box",
              route: "/catalogue",
            },
            // {
            //   libelle: "Service",
            //   icone: "pi pi-building",
            //   route: "admin/parametres/services",
            // },
            // {
            //   libelle: "Personnel",
            //   icone: "pi pi-users",
            //   route: "admin/parametres/personnels",
            // },
            {
              libelle: "Paramètres généraux",
              icone: "pi pi-sliders-h",
              route: "/admin/parametres/generaux",
            },
          ],
        },
      ],
    },
  ];

  protected basculer(): void {
    this.reduit = !this.reduit;
  }

  protected basculerSousMenu(element: ElementMenu): void {
    if (!element.enfants?.length) {
      return;
    }

    element.ouvert = !element.ouvert;
  }
}
