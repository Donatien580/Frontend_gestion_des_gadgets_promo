import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { CarteIndicateurComponent } from "../../../shared/components/carte-indicateur/carte-indicateur.component";
import { BadgeStatutComponent } from "../../../shared/components/badge-statut/badge-statut.component";
import { IDENTITES_MODULES } from "../../../shared/constantes/identites-modules";

type IdWidget = "kpis" | "raccourcis" | "demandes" | "alertes";

interface DefinitionWidget {
  id: IdWidget;
  titre: string;
  icone: string;
}

const CLE_STOCKAGE_ORDRE = "gadgets-dashboard-widgets-ordre";
const ORDRE_PAR_DEFAUT: IdWidget[] = [
  "kpis",
  "raccourcis",
  "demandes",
  "alertes",
];

/**
 * Vue d'ensemble de l'activité, organisée en widgets réorganisables par
 * glisser-déposer (Angular CDK). L'ordre choisi est mémorisé en localStorage
 * pour persister entre deux visites.
 *
 * Pour l'instant alimentée par des données de démonstration
 */
@Component({
  selector: "app-tableau-de-bord",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DragDropModule,
    CarteIndicateurComponent,
    BadgeStatutComponent,
  ],
  templateUrl: "./tableau-de-bord.component.html",
  styleUrl: "./tableau-de-bord.component.scss",
})
export class TableauDeBordComponent {
  protected readonly definitionsWidgets: Record<IdWidget, DefinitionWidget> = {
    kpis: { id: "kpis", titre: "Indicateurs clés", icone: "pi pi-chart-line" },
    raccourcis: {
      id: "raccourcis",
      titre: "Accès rapides",
      icone: "pi pi-th-large",
    },
    demandes: {
      id: "demandes",
      titre: "Demandes récentes",
      icone: "pi pi-inbox",
    },
    alertes: {
      id: "alertes",
      titre: "Alertes seuil de stock",
      icone: "pi pi-exclamation-triangle",
    },
  };

  protected readonly ordreWidgets = signal<IdWidget[]>(this.chargerOrdre());

  protected readonly modulesRaccourcis = Object.values(
    IDENTITES_MODULES,
  ).filter((m) => m.id !== "admin");

  protected readonly alertesStock = [
    { libelle: "Casquettes brodées", quantite: 12, seuil: 50 },
    { libelle: "Clés USB 16 Go", quantite: 8, seuil: 30 },
    { libelle: "Carnets A5", quantite: 21, seuil: 40 },
  ];

  protected readonly demandesRecentes = [
    {
      numero: "DEM-2026-0142",
      objet: "Kit de bienvenue partenaires",
      etat: "EN_ATTENTE",
      type: "Externe",
    },
    {
      numero: "DEM-2026-0141",
      objet: "Goodies séminaire annuel",
      etat: "VALIDEE_CHEF_DEPARTEMENT",
      type: "Interne",
    },
    {
      numero: "DEM-2026-0140",
      objet: "Cadeaux fin d'année - Service RH",
      etat: "AFFECTEE",
      type: "Interne",
    },
    {
      numero: "DEM-2026-0139",
      objet: "Stand salon professionnel",
      etat: "TRAITEE",
      type: "Externe",
    },
  ];

  deposerWidget(evenement: CdkDragDrop<IdWidget[]>): void {
    const ordre = [...this.ordreWidgets()];
    moveItemInArray(ordre, evenement.previousIndex, evenement.currentIndex);
    this.ordreWidgets.set(ordre);
    localStorage.setItem(CLE_STOCKAGE_ORDRE, JSON.stringify(ordre));
  }

  private chargerOrdre(): IdWidget[] {
    try {
      const stocke = localStorage.getItem(CLE_STOCKAGE_ORDRE);
      if (!stocke) return ORDRE_PAR_DEFAUT;
      const ordre = JSON.parse(stocke) as IdWidget[];
      // Filet de sécurité : si de nouveaux widgets sont ajoutés plus tard,
      // on les rajoute à la fin plutôt que de les faire disparaître.
      const complet = [
        ...ordre,
        ...ORDRE_PAR_DEFAUT.filter((id) => !ordre.includes(id)),
      ];
      return complet.filter((id) => ORDRE_PAR_DEFAUT.includes(id));
    } catch {
      return ORDRE_PAR_DEFAUT;
    }
  }
}
