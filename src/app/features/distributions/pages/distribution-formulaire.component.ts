// import { Component, EventEmitter, OnInit, Output } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from "@angular/forms";
// import { forkJoin } from "rxjs";
// import {
//   DistributionRequest,
//   Demande,
//   PageResponse,
// } from "../../../core/models";
// import { DistributionService } from "../services/distribution.service";
// import { DemandeService } from "../../demandes/services/demande.service";
// import { NotificationService } from "../../../core/services/notification.service";

// @Component({
//   selector: "app-distribution-formulaire",
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: "./distribution-formulaire.component.html",
//   styleUrls: ["./distribution-formulaire.component.scss"],
// })
// export class DistributionFormulaireComponent implements OnInit {
//   @Output() enregistre = new EventEmitter<void>();
//   @Output() annuler = new EventEmitter<void>();

//   formulaire!: FormGroup;
//   demandesAcceptees: Demande[] = [];
//   enregistrement = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private distributionService: DistributionService,
//     private demandeService: DemandeService,
//     private notification: NotificationService,
//   ) {
//     this.initialiserFormulaire();
//   }

//   ngOnInit(): void {
//     this.chargerDemandesAcceptees();
//   }

//   initialiserFormulaire(): void {
//     this.formulaire = this.formBuilder.group({
//       idDemande: [null, Validators.required],
//       dateDistribution: [new Date().toISOString().slice(0, 16)],
//       motif: [""],
//       destinataire: [{ value: "", disabled: true }], // pré-rempli automatiquement
//     });
//   }

//   chargerDemandesAcceptees(): void {
//     // Charger les demandes validées et traitées
//     forkJoin({
//       validees: this.demandeService.lister(
//         "VALIDEE_CHEF_DEPARTEMENT",
//         "",
//         0,
//         100,
//       ),
//       traitees: this.demandeService.lister("TRAITEE", "", 0, 100),
//     }).subscribe({
//       next: (result) => {
//         this.demandesAcceptees = [
//           ...result.validees.content,
//           ...result.traitees.content,
//         ];
//         // Optionnel : supprimer les doublons si besoin
//         this.demandesAcceptees = this.demandesAcceptees.filter(
//           (demande, index, self) =>
//             index === self.findIndex((d) => d.idDemande === demande.idDemande),
//         );
//       },
//       error: (err) => {
//         console.error("Erreur lors du chargement des demandes acceptées", err);
//         this.notification.error("Impossible de charger les demandes acceptées");
//       },
//     });
//   }
//   // chargerDemandesAcceptees(): void {
//   //   // Récupérer les demandes à l'état TRAITEE (acceptées)
//   //   this.demandeService.lister("TRAITEE", "", 0, 100).subscribe({
//   //     next: (page: PageResponse<Demande>) => {
//   //       this.demandesAcceptees = page.content;
//   //     },
//   //     error: () =>
//   //       this.notification.error(
//   //         "Erreur lors du chargement des demandes acceptées",
//   //       ),
//   //   });
//   // }

//   onDemandeSelected(idDemande: number): void {
//     const demande = this.demandesAcceptees.find(
//       (d) => d.idDemande === idDemande,
//     );
//     if (demande) {
//       let destinataire = "";
//       if (demande.typeDemande === "INTERNE") {
//         destinataire = `${demande.libelleService} - Responsable: ${demande.nomResponsable} (${demande.matriculeResponsable})`;
//       } else {
//         destinataire = `Structure: ${demande.structure} - Représentant: ${demande.representant}`;
//       }
//       this.formulaire.get("destinataire")?.setValue(destinataire);
//       // Pré-remplir le motif avec l'objet de la demande
//       if (!this.formulaire.get("motif")?.value) {
//         this.formulaire.get("motif")?.setValue(demande.objet);
//       }
//     }
//   }

//   enregistrer(): void {
//     if (this.formulaire.invalid) {
//       this.formulaire.markAllAsTouched();
//       this.notification.error("Veuillez sélectionner une demande");
//       return;
//     }

//     const valeurs = this.formulaire.getRawValue();
//     const requete: DistributionRequest = {
//       idDemande: valeurs.idDemande,
//       dateDistribution: valeurs.dateDistribution,
//       motif: valeurs.motif,
//       destinataire: valeurs.destinataire,
//     };

//     this.enregistrement = true;
//     this.distributionService.creer(requete).subscribe({
//       next: () => {
//         this.notification.success("Distribution créée");
//         this.enregistrement = false;
//         this.enregistre.emit();
//       },
//       error: () => {
//         this.enregistrement = false;
//         this.notification.error(
//           "Erreur lors de la création de la distribution",
//         );
//       },
//     });
//   }
// }

import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { forkJoin } from "rxjs";
import {
  DistributionRequest,
  Demande,
  PageResponse,
} from "../../../core/models";
import { DistributionService } from "../services/distribution.service";
import { DemandeService } from "../../demandes/services/demande.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: "app-distribution-formulaire",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./distribution-formulaire.component.html",
  styleUrls: ["./distribution-formulaire.component.scss"],
})
export class DistributionFormulaireComponent implements OnInit {
  @Output() enregistre = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  formulaire!: FormGroup;
  demandesAcceptees: Demande[] = [];
  enregistrement = false;

  constructor(
    private formBuilder: FormBuilder,
    private distributionService: DistributionService,
    private demandeService: DemandeService,
    private notification: NotificationService,
  ) {
    this.initialiserFormulaire();
  }

  ngOnInit(): void {
    this.chargerDemandesAcceptees();
  }

  initialiserFormulaire(): void {
    this.formulaire = this.formBuilder.group({
      idDemande: [null, Validators.required],
      dateDistribution: [new Date().toISOString().slice(0, 16)],
      motif: [""],
      destinataire: [""], // champ normal, pas disabled
    });
  }

  chargerDemandesAcceptees(): void {
    forkJoin({
      validees: this.demandeService.lister(
        "VALIDEE_CHEF_DEPARTEMENT",
        "",
        0,
        100,
      ),
      traitees: this.demandeService.lister("TRAITEE", "", 0, 100),
    }).subscribe({
      next: (result) => {
        this.demandesAcceptees = [
          ...result.validees.content,
          ...result.traitees.content,
        ];
        // Supprimer les doublons éventuels
        this.demandesAcceptees = this.demandesAcceptees.filter(
          (demande, index, self) =>
            index === self.findIndex((d) => d.idDemande === demande.idDemande),
        );
      },
      error: (err) => {
        console.error("Erreur lors du chargement des demandes acceptées", err);
        this.notification.error("Impossible de charger les demandes acceptées");
      },
    });
  }

  /**
   * Appelée lors de la sélection d'une demande.
   * Convertit l'id en nombre, puis met à jour le destinataire et le motif.
   */
  onDemandeSelected(idDemande: number | string): void {
    const id = Number(idDemande);
    const demande = this.demandesAcceptees.find((d) => d.idDemande === id);
    if (demande) {
      let destinataire = "";
      if (demande.typeDemande === "INTERNE") {
        destinataire = `${demande.libelleService} - Responsable: ${demande.nomResponsable} (${demande.matriculeResponsable})`;
      } else {
        destinataire = `Structure: ${demande.structure} - Représentant: ${demande.representant}`;
      }

      this.formulaire.patchValue({
        destinataire: destinataire,
        motif: this.formulaire.get("motif")?.value || demande.objet,
      });
    }
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      this.notification.error("Veuillez sélectionner une demande");
      return;
    }

    const valeurs = this.formulaire.getRawValue();
    const requete: DistributionRequest = {
      idDemande: valeurs.idDemande,
      dateDistribution: valeurs.dateDistribution,
      motif: valeurs.motif,
      destinataire: valeurs.destinataire,
    };

    this.enregistrement = true;
    this.distributionService.creer(requete).subscribe({
      next: () => {
        this.notification.success("Distribution créée");
        this.enregistrement = false;
        this.enregistre.emit();
      },
      error: (err) => {
        console.error(err);
        this.enregistrement = false;
        this.notification.error(
          "Erreur lors de la création de la distribution",
        );
      },
    });
  }
}
