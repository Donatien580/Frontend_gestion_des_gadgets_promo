// import { Component, EventEmitter, Input, Output } from "@angular/core";
// import { Distribution, Demande } from "../../../core/models";
// import { DistributionService } from "../services/distribution.service";
// import { CommonModule } from "@angular/common";
// import { ButtonModule } from "primeng/button";
// import { DemandeService } from "../../demandes/services/demande.service";

// @Component({
//   selector: "app-distribution-detail",
//   imports: [CommonModule, ButtonModule],
//   templateUrl: "./distribution-detail.component.html",
//   styleUrls: ["./distribution-detail.component.scss"],
// })
// export class DistributionDetailComponent {
//   @Input() distribution: Distribution | null = null;
//   @Output() signe = new EventEmitter<void>();
//   @Output() actionEffectuee = new EventEmitter<void>();

//   constructor(private distributionService: DistributionService) {}

//   executer(): void {
//     if (!this.distribution) return;
//     this.distributionService
//       .executer(this.distribution.idDistribution)
//       .subscribe({
//         next: () => this.actionEffectuee.emit(),
//         error: (err) => console.error(err),
//       });
//   }

//   genererPdf(): void {
//     if (!this.distribution) return;
//     this.distributionService
//       .genererBordereauPdf(this.distribution.idDistribution)
//       .subscribe((blob) => {
//         const url = window.URL.createObjectURL(blob);
//         window.open(url, "_blank");
//         setTimeout(() => window.URL.revokeObjectURL(url), 100);
//       });
//   }

//   signer(): void {
//     if (!this.distribution) return;
//     const signePar = prompt("Nom du signataire :");
//     if (!signePar) return;
//     this.distributionService
//       .signer(this.distribution.idDistribution, signePar)
//       .subscribe({
//         next: () => this.actionEffectuee.emit(),
//         error: (err) => console.error(err),
//       });
//   }

//   // signer(): void {
//   //   this.signe.emit();
//   // }

//   getEtatLibelle(etat: string): string {
//     switch (etat) {
//       case "EN_ATTENTE":
//         return "En attente";
//       case "BORDEREAU_GENERE":
//         return "Bordereau généré";
//       case "SIGNEE":
//         return "Signée";
//       case "ANNULEE":
//         return "Annulée";
//       default:
//         return etat;
//     }
//   }

//   getEtatClasse(etat: string): string {
//     switch (etat) {
//       case "EN_ATTENTE":
//         return "statut-attente";
//       case "BORDEREAU_GENERE":
//         return "statut-valide";
//       case "SIGNEE":
//         return "statut-traitee";
//       case "ANNULEE":
//         return "statut-annulee";
//       default:
//         return "";
//     }
//   }
// }

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { Distribution, Demande } from "../../../core/models";
import { DistributionService } from "../services/distribution.service";
import { DemandeService } from "../../demandes/services/demande.service";

@Component({
  selector: "app-distribution-detail",
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: "./distribution-detail.component.html",
  styleUrls: ["./distribution-detail.component.scss"],
})
export class DistributionDetailComponent implements OnInit {
  @Input() distribution: Distribution | null = null;
  @Output() signe = new EventEmitter<void>();
  @Output() actionEffectuee = new EventEmitter<void>();

  demande: Demande | null = null;

  constructor(
    private distributionService: DistributionService,
    private demandeService: DemandeService,
  ) {}

  ngOnInit(): void {
    if (this.distribution) {
      this.chargerDemande(this.distribution.idDemande);
    }
  }

  private chargerDemande(idDemande: number): void {
    this.demandeService.obtenir(idDemande).subscribe({
      next: (demande) => (this.demande = demande),
      error: (err) => console.error("Erreur chargement demande liée", err),
    });
  }

  executer(): void {
    if (!this.distribution) return;
    this.distributionService
      .executer(this.distribution.idDistribution)
      .subscribe({
        next: () => this.actionEffectuee.emit(),
        error: (err) => console.error(err),
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

  signer(): void {
    if (!this.distribution) return;
    const signePar = prompt("Nom du signataire :");
    if (!signePar) return;
    this.distributionService
      .signer(this.distribution.idDistribution, signePar)
      .subscribe({
        next: () => this.actionEffectuee.emit(),
        error: (err) => console.error(err),
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
      case "EXECUTEE":
        return "statut-valide";
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

  /**
   * Total des gadgets distribués (somme des quantités de toutes les lignes)
   */
  get totalGadgetsDistribues(): number {
    if (!this.distribution) return 0;
    return this.distribution.lignes.reduce(
      (somme, ligne) => somme + ligne.quantiteDistribuee,
      0,
    );
  }
}
