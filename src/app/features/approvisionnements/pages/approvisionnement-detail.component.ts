import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  Approvisionnement,
  CorrectionApprovisionnementRequest,
  LigneApprovisionnement,
} from "../../../core/models";

export interface LigneCorrigeeEvent {
  idApprovisionnement: number;
  requete: CorrectionApprovisionnementRequest;
}

@Component({
  selector: "app-approvisionnement-detail",
  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: "./approvisionnement-detail.component.html",
  styleUrl: "./approvisionnement-detail.component.scss",
})
export class ApprovisionnementDetailComponent {
  @Input()
  approvisionnement: Approvisionnement | null = null;

  @Input()
  chargement = false;

  /** Émis quand l'utilisateur valide la correction d'une ligne. */
  @Output()
  ligneCorrigee = new EventEmitter<LigneCorrigeeEvent>();

  /** Id de la ligne actuellement en cours de correction (une seule à la fois). */
  ligneEnEditionId: number | null = null;

  formCorrection = {
    quantiteRecue: 0,
    quantiteDefectueuse: 0,
    motifCorrection: "",
  };

  /* LIGNES ACTIVES = état courant pris en compte pour le stock */
  get lignesActives(): LigneApprovisionnement[] {
    return (
      this.approvisionnement?.lignes.filter((ligne) => ligne.actif !== false) ??
      []
    );
  }

  /* LIGNES DÉSACTIVÉES = historique des erreurs de saisie déjà corrigées */
  get lignesHistorique(): LigneApprovisionnement[] {
    return (
      this.approvisionnement?.lignes.filter((ligne) => ligne.actif === false) ??
      []
    );
  }

  estEnEdition(ligne: LigneApprovisionnement): boolean {
    return this.ligneEnEditionId === ligne.idLigne;
  }

  /* DÉMARRER LA CORRECTION D'UNE LIGNE */
  demarrerCorrection(ligne: LigneApprovisionnement): void {
    this.ligneEnEditionId = ligne.idLigne;
    this.formCorrection = {
      quantiteRecue: ligne.quantiteRecue,
      quantiteDefectueuse: ligne.quantiteDefectueuse ?? 0,
      motifCorrection: "",
    };
  }

  annulerCorrection(): void {
    this.ligneEnEditionId = null;
  }

  /* QUANTITÉ CONFORME RECALCULÉE PENDANT LA SAISIE DE LA CORRECTION */
  get conformeCorrigee(): number {
    return Math.max(
      0,
      (this.formCorrection.quantiteRecue || 0) -
        (this.formCorrection.quantiteDefectueuse || 0),
    );
  }

  correctionInvalide(): boolean {
    return (
      !this.formCorrection.quantiteRecue ||
      this.formCorrection.quantiteRecue < 1 ||
      this.formCorrection.quantiteDefectueuse < 0 ||
      this.formCorrection.quantiteDefectueuse >
        this.formCorrection.quantiteRecue ||
      !this.formCorrection.motifCorrection.trim()
    );
  }

  /* VALIDER LA CORRECTION ET LA REMONTER AU PARENT */
  validerCorrection(ligne: LigneApprovisionnement): void {
    if (!this.approvisionnement || this.correctionInvalide()) {
      return;
    }

    this.ligneCorrigee.emit({
      idApprovisionnement: this.approvisionnement.idApprovisionnement,
      requete: {
        lignes: [
          {
            idLigne: ligne.idLigne,
            quantiteCommandee: ligne.quantiteCommandee,
            quantiteRecue: this.formCorrection.quantiteRecue,
            quantiteDefectueuse: this.formCorrection.quantiteDefectueuse,
            observationQualite: ligne.observationQualite,
            motifCorrection: this.formCorrection.motifCorrection.trim(),
          },
        ],
      },
    });

    this.ligneEnEditionId = null;
  }
}
