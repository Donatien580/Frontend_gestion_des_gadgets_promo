import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SelectModule } from "primeng/select";

import {
  Categorie,
  Gadget,
  Inventaire,
  LigneInventaire,
} from "../../../core/models";
import { InventaireService } from "../services/inventaire.service";
import { GadgetService } from "../../catalogue/services/gadget.service";
import { CategorieService } from "../../catalogue/services/categorie.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: "app-inventaire-detail",
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, FormsModule, SelectModule],

  templateUrl: "./inventaire-detail.component.html",
  styleUrl: "./inventaire-detail.component.scss",
})
export class InventaireDetailComponent implements OnInit, OnChanges {
  @Input()
  inventaire: Inventaire | null = null;

  @Output()
  modifie = new EventEmitter<void>();

  gadgetsDisponibles: Gadget[] = [];
  categoriesDisponibles: Categorie[] = [];
  categorieSelectionnee: number | null = null;

  formulaireLigne: FormGroup;
  enregistrementLigne = false;

  ligneEnJustification: number | null = null;
  texteJustification = "";
  enregistrementJustification = false;

  enregistrementTransition = false;

  constructor(
    private formBuilder: FormBuilder,
    private inventaireService: InventaireService,
    private gadgetService: GadgetService,
    private categorieService: CategorieService,
    private notification: NotificationService,
  ) {
    this.formulaireLigne = this.formBuilder.group({
      idGadget: [null, [Validators.required]],
      stockReel: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.categorieService.lister().subscribe({
      next: (categories) => {
        this.categoriesDisponibles = categories;
      },
      error: (err) => {
        console.error("Erreur chargement catégories", err);
        this.notification.error("Erreur lors du chargement des catégories.");
      },
    });

    this.chargerGadgets(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["inventaire"] && this.inventaire) {
      this.formulaireLigne.reset({ idGadget: null, stockReel: null });
      this.ligneEnJustification = null;
    }
  }

  /* CHARGER LES GADGETS (filtrés par catégorie si fournie)*/
  chargerGadgets(idCategorie: number | null): void {
    const options = {
      page: 0,
      taille: 200,
      idCategorie: idCategorie ?? undefined,
    };
    this.gadgetService.lister(options).subscribe({
      next: (page) => {
        this.gadgetsDisponibles = page.content;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des gadgets", error);
        this.notification.error("Erreur lors du chargement des gadgets.");
      },
    });
  }

  /*Appelé quand la catégorie sélectionnée change - recharge les gadgets correspondants*/
  onCategorieChange(idCategorie: number | null): void {
    this.categorieSelectionnee = idCategorie;
    this.formulaireLigne.get("idGadget")?.reset(null);
    this.chargerGadgets(idCategorie);
  }

  get enCours(): boolean {
    return this.inventaire?.etat === "EN_COURS";
  }

  get termine(): boolean {
    return this.inventaire?.etat === "TERMINE";
  }

  get valide(): boolean {
    return this.inventaire?.etat === "VALIDE";
  }

  get justificationPossible(): Boolean {
    return (
      this.inventaire?.etat === "EN_COURS" ||
      this.inventaire?.etat === "TERMINE"
    );
  }

  necessiteJustification(ligne: LigneInventaire): boolean {
    return ligne.ecart !== 0;
  }

  /* SAISIR LE RÉSULTAT D'UNE LIGNE*/
  saisirLigne(): void {
    if (!this.inventaire) {
      return;
    }

    if (this.formulaireLigne.invalid) {
      this.formulaireLigne.markAllAsTouched();
      this.notification.error(
        "Sélectionnez un gadget et saisissez le stock réel compté.",
      );
      return;
    }

    this.enregistrementLigne = true;
    const valeurs = this.formulaireLigne.getRawValue();

    this.inventaireService
      .saisirLigne(this.inventaire.idInventaire, {
        idGadget: valeurs.idGadget,
        stockReel: valeurs.stockReel,
      })
      .subscribe({
        next: (inventaireMisAJour) => {
          this.notification.success("Comptage enregistré.");
          this.inventaire = inventaireMisAJour;
          this.formulaireLigne.reset({ idGadget: null, stockReel: null });
          this.enregistrementLigne = false;
          this.modifie.emit();
        },
        error: (error) => {
          console.error("Erreur lors de la saisie du comptage", error);
          this.notification.error(
            error?.error?.message || "Erreur lors de la saisie du comptage.",
          );
          this.enregistrementLigne = false;
        },
      });
  }

  /* JUSTIFICATION D'UN ÉCART*/
  ouvrirJustification(ligne: LigneInventaire): void {
    this.ligneEnJustification = ligne.idLigne;
    this.texteJustification = ligne.justification || "";
  }

  annulerJustification(): void {
    this.ligneEnJustification = null;
    this.texteJustification = "";
  }

  enregistrerJustification(ligne: LigneInventaire): void {
    if (!this.inventaire) {
      return;
    }

    if (!this.texteJustification.trim()) {
      this.notification.error("La justification est obligatoire.");
      return;
    }

    this.enregistrementJustification = true;

    this.inventaireService
      .justifierEcart(this.inventaire.idInventaire, ligne.idLigne, {
        justification: this.texteJustification.trim(),
      })
      .subscribe({
        next: (inventaireMisAJour) => {
          this.notification.success("Justification enregistrée.");
          this.inventaire = inventaireMisAJour;
          this.ligneEnJustification = null;
          this.texteJustification = "";
          this.enregistrementJustification = false;
          this.modifie.emit();
        },
        error: (error) => {
          console.error(
            "Erreur lors de l'enregistrement de la justification",
            error,
          );
          this.notification.error(
            error?.error?.message ||
              "Erreur lors de l'enregistrement de la justification.",
          );
          this.enregistrementJustification = false;
        },
      });
  }

  /* TERMINER LA SAISIE*/
  terminer(): void {
    if (!this.inventaire) {
      return;
    }

    this.enregistrementTransition = true;

    this.inventaireService.terminer(this.inventaire.idInventaire).subscribe({
      next: (inventaireMisAJour) => {
        this.notification.success("Inventaire marqué comme terminé.");
        this.inventaire = inventaireMisAJour;
        this.enregistrementTransition = false;
        this.modifie.emit();
      },
      error: (error) => {
        console.error("Erreur lors de la clôture de la saisie", error);
        this.notification.error(
          error?.error?.message || "Erreur lors de la clôture de la saisie.",
        );
        this.enregistrementTransition = false;
      },
    });
  }

  /* VALIDER L'INVENTAIRE*/
  valider(): void {
    if (!this.inventaire) {
      return;
    }

    this.enregistrementTransition = true;

    this.inventaireService.valider(this.inventaire.idInventaire).subscribe({
      next: (inventaireMisAJour) => {
        this.notification.success(
          "Inventaire validé, le stock a été mis à jour.",
        );
        this.inventaire = inventaireMisAJour;
        this.enregistrementTransition = false;
        this.modifie.emit();
      },
      error: (error) => {
        console.error("Erreur lors de la validation de l'inventaire", error);
        this.notification.error(
          error?.error?.message ||
            "Erreur lors de la validation de l'inventaire.",
        );
        this.enregistrementTransition = false;
      },
    });
  }
}
