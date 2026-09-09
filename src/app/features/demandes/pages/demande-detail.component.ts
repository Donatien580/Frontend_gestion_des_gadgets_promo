import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Demande, EtatDemande } from "../../../core/models";
import { DemandeService } from "../services/demande.service";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { NotificationService } from "../../../core/services/notification.service";
import { TextareaModule } from "primeng/textarea";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-demande-detail",
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    TextareaModule,
  ],
  templateUrl: "./demande-detail.component.html",
  styleUrls: ["./demande-detail.component.scss"],
})
export class DemandeDetailComponent {
  @Input() demande: Demande | null = null;
  @Output() actionEffectuee = new EventEmitter<void>();
  @Output() fermer = new EventEmitter<void>();

  refusDialogVisible = false;
  motifRefus = "";

  constructor(
    private demandeService: DemandeService,
    private notification: NotificationService,
  ) {}

  ouvrirRefusDialog(): void {
    this.motifRefus = "";
    this.refusDialogVisible = true;
  }

  // Ferme le popup sans refuser
  fermerRefusDialog(): void {
    this.refusDialogVisible = false;
  }

  // Confirme le refus avec le motif saisi
  confirmerRefus(): void {
    if (!this.demande) return;
    if (!this.motifRefus.trim()) {
      return;
    }
    this.demandeService
      .refuser(this.demande.idDemande, this.motifRefus.trim())
      .subscribe({
        next: () => {
          this.refusDialogVisible = false;
          this.motifRefus = "";
          this.actionEffectuee.emit();
        },
        error: (err) => {
          console.error("Erreur lors du refus", err);
          this.refusDialogVisible = false;
        },
      });
  }

  getPieceUrl(chemin: string): string {
    return this.demandeService.getPieceUrl(chemin);
  }

  getEtatLibelle(etat: EtatDemande): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "En attente";
      case "VALIDEE_CHEF_DEPARTEMENT":
        return "Validée";
      case "AFFECTEE":
        return "Affectée";
      case "TRAITEE":
        return "Traitée";
      case "REFUSEE":
        return "Refusée";
      case "ANNULEE":
        return "Annulée";
      default:
        return "Inconnu";
    }
  }

  getEtatClasse(etat: EtatDemande): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "statut-attente";
      case "VALIDEE_CHEF_DEPARTEMENT":
        return "statut-valide";
      case "AFFECTEE":
        return "statut-affectee";
      case "TRAITEE":
        return "statut-traitee";
      case "REFUSEE":
        return "statut-refusee";
      case "ANNULEE":
        return "statut-annulee";
      default:
        return "";
    }
  }

  valider(): void {
    if (!this.demande) return;
    this.demandeService.valider(this.demande.idDemande).subscribe({
      next: () => {
        this.notification.success("Demande validée avec succès.");
        this.actionEffectuee.emit();
      },
      error: (err) => {
        console.error("Erreur lors de la validation", err);
        this.notification.error("Erreur lors de la validation.");
      },
    });
  }

  refuser(): void {
    if (!this.demande) return;
    if (!this.motifRefus.trim()) {
      this.notification.error("Veuillez saisir un motif de refus.");
      return;
    }
    this.demandeService
      .refuser(this.demande.idDemande, this.motifRefus.trim())
      .subscribe({
        next: () => {
          this.notification.success("Demande refusée avec succès.");
          this.motifRefus = "";
          this.actionEffectuee.emit();
        },
        error: (err) => {
          console.error("Erreur lors du refus", err);
          this.notification.error("Erreur lors du refus.");
        },
      });
  }

  affecter(): void {
    if (!this.demande) return;
    this.demandeService.affecter(this.demande.idDemande).subscribe({
      next: () => {
        this.notification.success("Demande affectée avec succès.");
        this.actionEffectuee.emit();
      },
      error: (err) => {
        console.error("Erreur lors de l'affectation", err);
        this.notification.error("Erreur lors de l'affectation.");
      },
    });
  }
}
