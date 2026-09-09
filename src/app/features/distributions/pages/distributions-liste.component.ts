import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Distribution, PageResponse } from "../../../core/models";
import { DistributionService } from "../services/distribution.service";
import { NotificationService } from "../../../core/services/notification.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { Breadcrumb } from "primeng/breadcrumb";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DistributionFormulaireComponent } from "./distribution-formulaire.component";
import { DistributionDetailComponent } from "./distribution-detail.component";

@Component({
  selector: "app-distribution-liste",
  imports: [
    CommonModule,
    CardModule,
    Breadcrumb,
    FormsModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    DialogModule,
    DistributionFormulaireComponent,
    DistributionDetailComponent,
  ],
  templateUrl: "./distributions-liste.component.html",
  styleUrls: ["./distributions-liste.component.scss"],
})
export class DistributionListeComponent implements OnInit {
  distributions: Distribution[] = [];
  isLoading = false;

  // Pagination
  totalRecords = 0;
  recordsPerPage = 10;
  currentPage = 0;

  // Modales
  creationVisible = false;
  detailVisible = false;
  distributionDetail: Distribution | null = null;

  items: MenuItem[] = [];

  constructor(
    private distributionService: DistributionService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.menuTool();
    this.loadAll();
  }

  menuTool(): void {
    this.items = [
      {
        label: "Accueil",
        icon: "pi pi-home",
        routerLink: ["/admin/dashboard"],
      },
      { label: "Distributions", icon: "pi pi-truck" },
    ];
  }

  message: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    text: string;
  } | null = null;

  loadAll(): void {
    this.isLoading = true;
    this.distributionService
      .lister(this.currentPage, this.recordsPerPage)
      .subscribe({
        next: (page: PageResponse<Distribution>) => {
          this.distributions = page.content.map((d) => ({
            ...d,
            dateDistribution: this.convertirDate(d.dateDistribution)!,
            dateGenerationBordereau: d.dateGenerationBordereau
              ? (this.convertirDate(d.dateGenerationBordereau) ?? undefined)
              : undefined,
            dateSignature: d.dateSignature
              ? (this.convertirDate(d.dateSignature) ?? undefined)
              : undefined,
          }));
          this.totalRecords = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.notification.error(
            "Erreur lors du chargement des distributions",
          );
        },
      });
  }

  changerPage(event: any): void {
    this.currentPage = event.page;
    this.recordsPerPage = event.rows;
    this.loadAll();
  }

  convertirDate(date: any): Date | null {
    if (!date) return null;
    if (Array.isArray(date)) {
      const [y, m, d, h = 0, min = 0, s = 0] = date;
      return new Date(y, m - 1, d, h, min, s);
    }
    return new Date(date);
  }

  // Actions
  ouvrirCreation(): void {
    this.creationVisible = true;
  }

  fermerCreation(): void {
    this.creationVisible = false;
  }

  onDistributionCreee(): void {
    this.fermerCreation();
    this.loadAll();
    this.notification.success("Distribution créée");
  }

  ouvrirDetail(distribution: Distribution): void {
    this.distributionDetail = distribution;
    this.detailVisible = true;
  }

  fermerDetail(): void {
    this.detailVisible = false;
    this.distributionDetail = null;
  }

  // Génération du bordereau PDF
  genererBordereau(id: number): void {
    this.distributionService.genererBordereauPdf(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      // Optionnel : recharger la liste pour refléter l'état BORDEREAU_GENERE
      this.loadAll();
    });
  }

  executer(id: number): void {
    this.distributionService.executer(id).subscribe({
      next: () => {
        this.showMessage({
          severity: "success",
          text: "Distribution exécutée avec succès",
        });
        this.loadAll();
      },
      error: (err) =>
        this.showMessage({
          severity: "error",
          text: "Erreur lors de l'exécution",
        }),
    });
  }

  // Signature manuelle
  signer(id: number): void {
    const signePar = prompt("Nom du signataire :");
    if (!signePar) return;
    this.distributionService.signer(id, signePar).subscribe({
      next: () => {
        this.notification.success("Bordereau signé");
        this.loadAll();
        if (this.distributionDetail?.idDistribution === id) {
          this.distributionDetail.signePar = signePar;
          this.distributionDetail.etat = "SIGNEE";
        }
      },
      error: () => this.notification.error("Erreur lors de la signature"),
    });
  }

  getEtatLibelle(etat: string): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "En attente";
      case "BORDEREAU_GENERE":
        return "Bordereau généré";
      case "SIGNEE":
        return "Signée";
      case "ANNULEE":
        return "Annulée";
      default:
        return etat;
    }
  }

  getEtatClasse(etat: string): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "statut-attente";
      case "BORDEREAU_GENERE":
        return "statut-valide";
      case "SIGNEE":
        return "statut-traitee";
      case "ANNULEE":
        return "statut-annulee";
      default:
        return "";
    }
  }
  showMessage(msg: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    text: string;
  }): void {
    this.message = msg;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}
