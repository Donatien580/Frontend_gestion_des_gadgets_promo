import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SelectModule } from "primeng/select";

import { InventaireService } from "../services/inventaire.service";
import { NotificationService } from "../../../core/services/notification.service";
import { TypeInventaire } from "../../../core/models";

@Component({
  selector: "app-inventaire-formulaire",
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, SelectModule],

  templateUrl: "./inventaire-formulaire.component.html",
  styleUrl: "./inventaire-formulaire.component.scss",
})
export class InventaireFormulaireComponent {
  @Output()
  enregistre = new EventEmitter<void>();

  @Output()
  annuler = new EventEmitter<void>();

  enregistrement = false;
  formulaire: FormGroup;

  typesDisponibles: { label: string; value: TypeInventaire }[] = [
    { label: "Trimestriel", value: "TRIMESTRIEL" },
    { label: "Exceptionnel", value: "EXCEPTIONNEL" },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inventaireService: InventaireService,
    private notification: NotificationService,
  ) {
    this.formulaire = this.formBuilder.group({
      dateInventaire: ["", [Validators.required]],
      typeInventaire: [null, [Validators.required]],
      observations: [""],
    });
  }

  /*ENREGISTRER */
  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      this.notification.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    this.enregistrement = true;

    const valeurs = this.formulaire.getRawValue();
    const donnees = {
      dateInventaire: valeurs.dateInventaire,
      typeInventaire: valeurs.typeInventaire,
      observations: valeurs.observations || undefined,
    };

    this.inventaireService.creer(donnees).subscribe({
      next: () => {
        this.notification.success("Inventaire créé.");
        this.enregistrement = false;
        this.reinitialiserFormulaire();
        this.enregistre.emit();
      },
      error: (error) => {
        console.error("Erreur lors de la création de l'inventaire", error);
        this.notification.error("Erreur lors de la création de l'inventaire.");
        this.enregistrement = false;
      },
    });
  }

  /*RÉINITIALISER LE FORMULAIRE*/
  reinitialiserFormulaire(): void {
    this.formulaire.reset({
      dateInventaire: "",
      typeInventaire: null,
      observations: "",
    });
  }

  /* ANNULER */
  annulerFormulaire(): void {
    this.annuler.emit();
  }

  /*GETTERS */
  get dateInventaire() {
    return this.formulaire.controls["dateInventaire"];
  }

  get typeInventaire() {
    return this.formulaire.controls["typeInventaire"];
  }
}
