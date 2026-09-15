import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { SelectModule } from "primeng/select";
import { AutoCompleteModule } from "primeng/autocomplete";

import { ApprovisionnementService } from "../services/approvisionnement.service";
import { GadgetService } from "../../catalogue/services/gadget.service";
import { CategorieService } from "../../catalogue/services/categorie.service";
import { NotificationService } from "../../../core/services/notification.service";

import { Categorie, Gadget } from "../../../core/models";

@Component({
  selector: "app-approvisionnement-formulaire",
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    AutoCompleteModule,
  ],

  templateUrl: "./approvisionnement-formulaire.component.html",
  styleUrl: "./approvisionnement-formulaire.component.scss",
})
export class ApprovisionnementFormulaireComponent implements OnInit {
  @Output()
  enregistre = new EventEmitter<void>();

  @Output()
  annuler = new EventEmitter<void>();

  categoriesDisponibles: Categorie[] = [];
  gadgetsParLigne: Gadget[][] = [];

  enregistrement = false;
  formulaire: FormGroup;

  suggestionsFournisseurs: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private approvisionnementService: ApprovisionnementService,
    private gadgetService: GadgetService,
    private categorieService: CategorieService,
    private notification: NotificationService,
  ) {
    this.formulaire = this.formBuilder.group({
      fournisseur: ["", [Validators.required]],
      adresseFournisseur: ["", [Validators.required]],
      numeroPV: ["", [Validators.pattern(/^\d*$/)]],
      numeroMarche: [""],
      observations: [""],
      lignes: this.formBuilder.array([this.creerLigne()]),
    });
  }

  /* INITIALISATION*/
  ngOnInit(): void {
    //this.chargerGadgets();
    this.categorieService.lister().subscribe({
      next: (categories) => {
        this.categoriesDisponibles = categories;
      },
      error: (err) => {
        console.error("Erreur chargement catégories", err);
        this.notification.error("Erreur lors du chargement des catégories.");
      },
    });
  }

  rechercherFournisseurs(event: { query: string }): void {
    this.approvisionnementService
      .suggererFournisseurs(event.query)
      .subscribe((resultats) => (this.suggestionsFournisseurs = resultats));
  }

  /* CHARGER LES GADGETS PAR CATEGORIE*/
  chargerGadgetsPourLigne(index: number, idCategorie: number | null): void {
    const options = {
      page: 0,
      taille: 200,
      idCategorie: idCategorie ?? undefined,
    };
    this.gadgetService.lister(options).subscribe({
      next: (page) => {
        this.gadgetsParLigne[index] = page.content;
      },
      error: (err) => {
        console.error("Erreur chargement gadgets", err);
        this.notification.error("Erreur lors du chargement des gadgets.");
      },
    });
  }

  onCategorieChange(index: number, idCategorie: number | null): void {
    this.lignes.at(index).get("idGadget")?.reset(null);
    this.chargerGadgetsPourLigne(index, idCategorie);
  }

  /* LIGNES*/
  get lignes(): FormArray {
    return this.formulaire.controls["lignes"] as FormArray;
  }

  ajouterLigne(): void {
    this.lignes.push(this.creerLigne());
    const nouvelIndex = this.lignes.length - 1;
    this.chargerGadgetsPourLigne(nouvelIndex, null);
  }

  retirerLigne(index: number): void {
    if (this.lignes.length > 1) {
      this.lignes.removeAt(index);
      this.gadgetsParLigne.splice(index, 1);
    }
  }

  /*CRÉER UNE LIGNE*/
  creerLigne(): FormGroup {
    return this.formBuilder.group(
      {
        idGadget: [null, [Validators.required]],
        quantiteCommandee: [null, [Validators.min(0)]],
        quantiteRecue: [1, [Validators.required, Validators.min(1)]],
        quantiteDefectueuse: [0, [Validators.min(0)]],
        observationQualite: [""],
      },
      {
        validators: this.verifierQuantiteDefectueuse,
      },
    );
  }

  /* CALCUL QUANTITÉ CONFORME (jamais envoyée au backend, juste pour l'affichage) */
  quantiteConforme(index: number): number {
    const ligne = this.lignes.at(index);
    const quantiteRecue = ligne.get("quantiteRecue")?.value || 0;
    const quantiteDefectueuse = ligne.get("quantiteDefectueuse")?.value || 0;
    return Math.max(0, quantiteRecue - quantiteDefectueuse);
  }

  verifierQuantiteDefectueuse(
    controle: AbstractControl,
  ): ValidationErrors | null {
    const quantiteRecue = controle.get("quantiteRecue")?.value || 0;
    const quantiteDefectueuse = controle.get("quantiteDefectueuse")?.value || 0;
    if (quantiteDefectueuse > quantiteRecue || quantiteDefectueuse < 0) {
      return { defectueuseSuperieureARecue: true };
    }
    return null;
  }

  /* NUMÉRO PV */
  get numeroPVApercu(): string {
    const numero = this.formulaire.controls["numeroPV"].value;
    if (!numero) {
      return "";
    }
    return "PV-" + numero.padStart(3, "0");
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
      fournisseur: valeurs.fournisseur,
      adresseFournisseur: valeurs.adresseFournisseur,
      numeroPV: valeurs.numeroPV
        ? "PV-" + valeurs.numeroPV.padStart(3, "0")
        : undefined,
      numeroMarche: valeurs.numeroMarche || undefined,
      observations: valeurs.observations || undefined,
      lignes: valeurs.lignes.map((ligne: any) => ({
        idGadget: ligne.idGadget,
        quantiteCommandee: ligne.quantiteCommandee || undefined,
        quantiteRecue: ligne.quantiteRecue,
        quantiteDefectueuse: ligne.quantiteDefectueuse || 0,
        observationQualite: ligne.observationQualite || undefined,
      })),
    };

    this.approvisionnementService.creer(donnees).subscribe({
      next: () => {
        this.notification.success("Approvisionnement enregistré.");
        this.enregistrement = false;
        this.reinitialiserFormulaire();
        this.enregistre.emit();
      },
      error: (error) => {
        console.error(
          "Erreur lors de l'enregistrement de l'approvisionnement",
          error,
        );
        this.notification.error(
          "Erreur lors de l'enregistrement de l'approvisionnement.",
        );
        this.enregistrement = false;
      },
    });
  }

  /*RÉINITIALISER LE FORMULAIRE*/
  reinitialiserFormulaire(): void {
    this.formulaire.reset({
      fournisseur: "",
      adresseFournisseur: "",
      numeroPV: "",
      numeroMarche: "",
      observations: "",
    });

    this.lignes.clear();
    this.lignes.push(this.creerLigne());
  }

  /* ANNULER */
  annulerFormulaire(): void {
    this.annuler.emit();
  }

  /*GETTERS */
  get fournisseur() {
    return this.formulaire.controls["fournisseur"];
  }

  get adresseFournisseur() {
    return this.formulaire.controls["adresseFournisseur"];
  }

  get numeroPV() {
    return this.formulaire.controls["numeroPV"];
  }

  get numeroMarche() {
    return this.formulaire.controls["numeroMarche"];
  }
}
