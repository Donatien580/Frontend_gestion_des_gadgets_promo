import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnTetePageComponent } from "../../../shared/components/en-tete-page/en-tete-page.component";

interface FicheRole {
  nom: string;
  description: string;
  icone: string;
  accent: "primary" | "success" | "warning" | "danger";
  nombreUtilisateurs: number;
}

@Component({
  selector: "app-roles-liste",
  standalone: true,
  imports: [CommonModule, EnTetePageComponent],
  templateUrl: "./roles-liste.component.html",
  styleUrl: "./roles-liste.component.scss",
})
export class RolesListeComponent {
  protected readonly roles: FicheRole[] = [
    {
      nom: "Administrateur",
      description:
        "Gère les paramétrages, les utilisateurs et les données techniques.",
      icone: "pi pi-shield",
      accent: "danger",
      nombreUtilisateurs: 1,
    },
    {
      nom: "Agent de saisie",
      description:
        "Saisit les demandes internes/externes, uploade les pièces justificatives.",
      icone: "pi pi-pencil",
      accent: "primary",
      nombreUtilisateurs: 1,
    },
    {
      nom: "Chef de département",
      description:
        "Valide/refuse/affecte les demandes, reçoit les alertes stratégiques.",
      icone: "pi pi-briefcase",
      accent: "warning",
      nombreUtilisateurs: 1,
    },
    {
      nom: "Chef de service",
      description:
        "Traite les demandes, vérifie le stock, génère et signe les bordereaux.",
      icone: "pi pi-verified",
      accent: "success",
      nombreUtilisateurs: 1,
    },
    {
      nom: "Gestionnaire de stock",
      description:
        "Gère le catalogue, les approvisionnements, les distributions, les inventaires.",
      icone: "pi pi-box",
      accent: "primary",
      nombreUtilisateurs: 1,
    },
  ];
}
