import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ElementMenu {
  libelle: string;
  icone: string;
  route: string;
}

interface GroupeMenu {
  titre: string | null;
  elements: ElementMenu[];
}

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss',
})
export class MenuLateralComponent {
  protected reduit = false;

  protected readonly groupesMenu: GroupeMenu[] = [
    {
      titre: null,
      elements: [
        { libelle: 'Tableau de bord', icone: 'pi pi-th-large', route: '/tableau-de-bord' },
        { libelle: 'Catalogue', icone: 'pi pi-box', route: '/catalogue' },
        { libelle: 'Approvisionnements', icone: 'pi pi-truck', route: '/approvisionnements' },
        { libelle: 'Demandes', icone: 'pi pi-inbox', route: '/demandes' },
        { libelle: 'Distributions', icone: 'pi pi-send', route: '/distributions' },
        { libelle: 'Inventaires', icone: 'pi pi-clipboard', route: '/inventaires' },
        { libelle: 'Rapports', icone: 'pi pi-chart-bar', route: '/rapports' },
      ],
    },
    {
      titre: 'Administration',
      elements: [
        { libelle: 'Utilisateurs', icone: 'pi pi-users', route: '/admin/utilisateurs' },
        { libelle: 'Rôles & permissions', icone: 'pi pi-shield', route: '/admin/roles' },
        { libelle: 'Paramètres', icone: 'pi pi-cog', route: '/admin/parametres' },
      ],
    },
  ];

  basculer(): void {
    this.reduit = !this.reduit;
  }
}
