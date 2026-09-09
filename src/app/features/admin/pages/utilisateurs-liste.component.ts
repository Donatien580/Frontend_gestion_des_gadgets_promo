import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BadgeStatutComponent } from "../../../shared/components/badge-statut/badge-statut.component";
import { EnTetePageComponent } from "../../../shared/components/en-tete-page/en-tete-page.component";

interface LigneUtilisateur {
  nomComplet: string;
  email: string;
  role: string;
  actif: boolean;
  initiales: string;
}

@Component({
  selector: "app-utilisateurs-liste",
  standalone: true,
  imports: [CommonModule, BadgeStatutComponent, EnTetePageComponent],
  templateUrl: "./utilisateurs-liste.component.html",
  styleUrl: "./utilisateurs-liste.component.scss",
})
export class UtilisateursListeComponent {
  protected readonly utilisateurs: LigneUtilisateur[] = [
    {
      nomComplet: "Aïssata Ouédraogo",
      email: "a.ouedraogo@dcm.bf",
      role: "Administrateur",
      actif: true,
      initiales: "AO",
    },
    {
      nomComplet: "Boureima Kaboré",
      email: "b.kabore@dcm.bf",
      role: "Gestionnaire de stock",
      actif: true,
      initiales: "BK",
    },
    {
      nomComplet: "Fatimata Sawadogo",
      email: "f.sawadogo@dcm.bf",
      role: "Chef de département",
      actif: true,
      initiales: "FS",
    },
    {
      nomComplet: "Issa Compaoré",
      email: "i.compaore@dcm.bf",
      role: "Chef de service",
      actif: true,
      initiales: "IC",
    },
    {
      nomComplet: "Mariam Zongo",
      email: "m.zongo@dcm.bf",
      role: "Agent de saisie",
      actif: false,
      initiales: "MZ",
    },
  ];
}
