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
  enCours = false;

  private readonly etatsClotures: EtatDemande[] = [
    "TRAITEE",
    "REFUSEE",
    "ANNULEE",
  ];

  constructor(
    private demandeService: DemandeService,
    private notification: NotificationService,
  ) {}

  get peutValider(): boolean {
    return this.demande?.etat === "EN_ATTENTE";
  }

  get peutRefuser(): boolean {
    return !!this.demande && !this.etatsClotures.includes(this.demande.etat);
  }

  ouvrirRefusDialog(): void {
    this.motifRefus = "";
    this.refusDialogVisible = true;
  }

  fermerRefusDialog(): void {
    this.refusDialogVisible = false;
  }

  confirmerRefus(): void {
    if (!this.demande || !this.motifRefus.trim()) return;

    this.enCours = true;
    this.demandeService
      .refuser(this.demande.idDemande, { motifRefus: this.motifRefus.trim() })
      .subscribe({
        next: () => {
          this.enCours = false;
          this.refusDialogVisible = false;
          this.motifRefus = "";
          this.notification.success("Demande refusée avec succès.");
          this.actionEffectuee.emit();
        },
        error: (erreur) => {
          this.enCours = false;
          this.notification.error(
            erreur?.error?.message || "Erreur lors du refus.",
          );
        },
      });
  }

  valider(): void {
    if (!this.demande) return;

    this.enCours = true;
    this.demandeService.valider(this.demande.idDemande).subscribe({
      next: () => {
        this.enCours = false;
        this.notification.success("Demande validée avec succès.");
        this.actionEffectuee.emit();
      },
      error: (erreur) => {
        this.enCours = false;
        this.notification.error(
          erreur?.error?.message || "Erreur lors de la validation.",
        );
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
}
