import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { Distribution } from "../../../core/models";
import { DistributionService } from "../services/distribution.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: "app-distribution-detail",
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: "./distribution-detail.component.html",
  styleUrls: ["./distribution-detail.component.scss"],
})
export class DistributionDetailComponent {
  @Input() distribution: Distribution | null = null;
  @Output() actionEffectuee = new EventEmitter<void>();

  constructor(
    private distributionService: DistributionService,
    private notification: NotificationService,
  ) {}

  executer(): void {
    if (!this.distribution) return;
    this.distributionService
      .executer(this.distribution.idDistribution)
      .subscribe({
        next: () => {
          this.notification.success("Distribution exécutée avec succès.");
          this.actionEffectuee.emit();
        },
        error: (erreur) =>
          this.notification.error(
            erreur?.error?.message || "Erreur lors de l'exécution.",
          ),
      });
  }

  genererPdf(): void {
    if (!this.distribution) return;
    this.distributionService
      .genererBordereauPdf(this.distribution.idDistribution)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      });
  }

  getEtatLibelle(etat: string): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "En attente";
      case "EXECUTEE":
        return "Exécutée";
      case "BORDEREAU_GENERE":
        return "Bordereau généré";
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
      case "EXECUTEE":
        return "statut-traitee";
      case "BORDEREAU_GENERE":
        return "statut-valide";
      case "ANNULEE":
        return "statut-annulee";
      default:
        return "";
    }
  }

  get totalGadgetsDistribues(): number {
    if (!this.distribution) return 0;
    return this.distribution.lignes.reduce(
      (somme, ligne) => somme + ligne.quantiteDistribuee,
      0,
    );
  }
}
