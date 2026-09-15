import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CarteIndicateurComponent } from "../../../shared/components/carte-indicateur/carte-indicateur.component";
import { BadgeStatutComponent } from "../../../shared/components/badge-statut/badge-statut.component";
import { IDENTITES_MODULES } from "../../../shared/constantes/identites-modules";
import { TableauDeBordService } from "../services/tableau-de-bord.service";
import {
  GadgetAlerte,
  NiveauStockGadget,
  TableauDeBord,
} from "../../../core/models/tableau-de-bord.model";
import { Demande } from "../../../core/models/demande.model";

type IdSection = "kpis" | "repartitionEtAlertes" | "raccourcis" | "demandes";

interface DefinitionSection {
  id: IdSection;
  titre: string;
  icone: string;
}

const SECTIONS: DefinitionSection[] = [
  { id: "kpis", titre: "Indicateurs clés", icone: "pi pi-chart-line" },
  { id: "repartitionEtAlertes", titre: "Stock", icone: "pi pi-database" },
  { id: "raccourcis", titre: "Accès rapides", icone: "pi pi-th-large" },
  { id: "demandes", titre: "Demandes récentes", icone: "pi pi-inbox" },
];

@Component({
  selector: "app-tableau-de-bord",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CarteIndicateurComponent,
    BadgeStatutComponent,
  ],
  templateUrl: "./tableau-de-bord.component.html",
  styleUrl: "./tableau-de-bord.component.scss",
})
export class TableauDeBordComponent implements OnInit {
  protected readonly sections = SECTIONS;
  protected readonly modulesRaccourcis = Object.values(
    IDENTITES_MODULES,
  ).filter((m) => m.id !== "admin");

  protected chargement = true;
  protected tableauDeBord: TableauDeBord | null = null;

  constructor(private tableauDeBordService: TableauDeBordService) {}

  ngOnInit(): void {
    this.tableauDeBordService.obtenir().subscribe({
      next: (donnees) => {
        this.tableauDeBord = donnees;
        this.chargement = false;
      },
      error: () => {
        this.chargement = false;
      },
    });
  }

  get demandesRecentes(): Demande[] {
    return this.tableauDeBord?.demandesRecentes ?? [];
  }

  get gadgetsAlertes(): GadgetAlerte[] {
    return this.tableauDeBord?.gadgetsAlertes ?? [];
  }

  get totalAlertes(): number {
    return (
      (this.tableauDeBord?.gadgetsEnAlerteCritique ?? 0) +
      (this.tableauDeBord?.gadgetsEnAlerteAvertissement ?? 0)
    );
  }

  get libelleCategories(): string {
    const total = this.tableauDeBord?.totalCategories ?? 0;
    return `Réparties sur ${total} catégorie${total > 1 ? "s" : ""}`;
  }

  get niveauxStockGadgets(): NiveauStockGadget[] {
    return this.tableauDeBord?.niveauxStockGadgets ?? [];
  }

  largeurBarre(quantite: number): number {
    const valeurs = this.niveauxStockGadgets.map((g) => g.quantiteDisponible);
    const max = valeurs.length ? Math.max(...valeurs) : 0;
    if (max === 0) return 0;
    return Math.max(4, Math.round((quantite / max) * 100));
  }

  classeNiveau(niveau: string): string {
    return niveau === "CRITIQUE" ? "niveau-critique" : "niveau-avertissement";
  }

  libelleNiveau(niveau: string): string {
    return niveau === "CRITIQUE" ? "Critique" : "À surveiller";
  }
}
