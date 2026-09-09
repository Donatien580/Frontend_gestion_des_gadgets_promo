import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
//import { RouterLink } from "@angular/router";
import { GadgetService } from "../services/gadget.service";
import { CategorieService } from "../services/categorie.service";
import { Gadget, Categorie } from "../../../core/models";
import { UrlPhotoPipe } from "../../../shared/pipes/url-photo.pipe";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-gadget-formulaire",
  standalone: true,

  imports: [ButtonModule, CommonModule, ReactiveFormsModule, UrlPhotoPipe],

  templateUrl: "./gadget-formulaire.component.html",
  styleUrl: "./gadget-formulaire.component.scss",
})
export class GadgetFormulaireComponent implements OnInit, OnChanges {
  @Input()
  idGadget: number | null = null;

  @Output() enregistre = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  categories: Categorie[] = [];
  fichierSelectionne: File | null = null;
  apercuUrl: string | null = null;
  isSaving = false;
  formulaire!: any;

  constructor(
    private formBuilder: FormBuilder,
    private gadgetService: GadgetService,
    private categorieService: CategorieService,
  ) {
    this.formulaire = this.formBuilder.group({
      libelle: ["", [Validators.required, Validators.maxLength(100)]],
      designation: ["", [Validators.maxLength(30)]],
      description: [""],
      seuilAlerte: [50, [Validators.required, Validators.min(0)]],
      idCategorie: [null as number | null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadGadget();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["idGadget"]) {
      this.loadGadget();
    }
  }

  loadCategories(): void {
    this.categorieService.lister().subscribe({
      next: (result) => {
        this.categories = result;
      },

      error: (error) => {
        console.error("Erreur lors du chargement des catégories", error);
      },
    });
  }

  loadGadget(): void {
    if (this.idGadget === null) {
      this.formulaire.reset({
        libelle: "",

        designation: "",

        description: "",

        seuilAlerte: 50,

        idCategorie: null,
      });

      this.fichierSelectionne = null;

      this.apercuUrl = null;

      return;
    }

    this.gadgetService.obtenir(this.idGadget).subscribe({
      next: (gadget) => {
        this.formulaire.patchValue({
          libelle: gadget.libelle,

          designation: gadget.designation || "",

          description: gadget.description || "",

          seuilAlerte: gadget.seuilAlerte,

          idCategorie: gadget.categorie.idCategorie,
        });

        if (gadget.photoGadget) {
          this.apercuUrl = gadget.photoGadget;
        }
      },

      error: (error) => {
        console.error("Erreur lors du chargement du gadget", error);
      },
    });
  }

  /*CHOISIR UNE PHOTO*/

  choisirPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.fichierSelectionne = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.apercuUrl = reader.result as string;
    };

    reader.readAsDataURL(this.fichierSelectionne);
  }

  Annuler(): void {
    this.annuler.emit();
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();

      return;
    }

    this.isSaving = true;

    const valeurs = this.formulaire.getRawValue();

    const requete = {
      libelle: valeurs.libelle!,

      designation: valeurs.designation || undefined,

      description: valeurs.description || undefined,

      seuilAlerte: valeurs.seuilAlerte!,

      idCategorie: valeurs.idCategorie!,
    };

    if (this.idGadget !== null) {
      this.gadgetService.modifier(this.idGadget, requete).subscribe({
        next: (gadget) => {
          this.enregistrerPhoto(gadget.idGadget);
        },

        error: (error) => {
          console.error("Erreur lors de la modification", error);

          this.isSaving = false;
        },
      });

      return;
    }

    this.gadgetService.creer(requete).subscribe({
      next: (gadget) => {
        this.enregistrerPhoto(gadget.idGadget);
      },

      error: (error) => {
        console.error("Erreur lors de la création", error);

        this.isSaving = false;
      },
    });
  }

  enregistrerPhoto(idGadget: number): void {
    if (!this.fichierSelectionne) {
      this.isSaving = false;

      this.enregistre.emit();

      return;
    }

    this.gadgetService
      .televerserPhoto(idGadget, this.fichierSelectionne)
      .subscribe({
        next: () => {
          this.isSaving = false;

          this.enregistre.emit();
        },

        error: (error) => {
          console.error("Erreur lors de l'envoi de la photo", error);

          this.isSaving = false;
        },
      });
  }

  get libelle() {
    return this.formulaire.controls.libelle;
  }

  get idCategorie() {
    return this.formulaire.controls.idCategorie;
  }
}
