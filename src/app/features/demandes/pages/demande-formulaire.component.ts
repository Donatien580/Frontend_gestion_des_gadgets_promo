import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { of, switchMap } from "rxjs";
import { DemandeService } from "../services/demande.service";
import { CategorieService } from "../../catalogue/services/categorie.service";
import { GadgetService } from "../../catalogue/services/gadget.service";
import { ServicesService } from "../../services/servcice/services.service";
import { CardModule } from "primeng/card";
import { NotificationService } from "../../../core/services/notification.service";
import {
  Gadget,
  Demande,
  DemandeRequest,
  TypeDemande,
  Categorie,
} from "../../../core/models";
import { SelectModule } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { Services } from "../../../core/models/service.model";
import { FieldsetModule } from "primeng/fieldset";

const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

@Component({
  selector: "app-demande-formulaire",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    SelectModule,
    FieldsetModule,
    FormsModule,
  ],
  templateUrl: "./demande-formulaire.component.html",
  styleUrls: ["./demande-formulaire.component.scss"],
})
export class DemandeFormulaireComponent implements OnInit {
  @Input() demande: Demande | null = null;
  @Output() enregistre = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  categoriesDisponibles: Categorie[] = [];
  servicesDisponibles: Services[] = [];
  enregistrement = false;

  gadgetsParLigne: Gadget[][] = [];

  fichierJustificatif: File | null = null;
  nomFichierJustificatif = "";

  formulaire!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private demandeService: DemandeService,
    private gadgetService: GadgetService,
    private categorieService: CategorieService,
    private servicesService: ServicesService,
    private notification: NotificationService,
  ) {
    this.initialiserFormulaire();
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

    //Charge les services pour la demande interne
    this.servicesService.lister().subscribe((services) => {
      this.servicesDisponibles = services;
    });

    if (this.demande) {
      this.remplirFormulaire(this.demande);
    } else {
      this.chargerGadgetsPourLigne(0, null);
    }
  }

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

  /*
   *lorsque la catégorie sélectionnée change, on recharge les gadgets correspondants.
   */
  onCategorieChange(index: number, idCategorie: number | null): void {
    this.lignes.at(index).get("idGadget")?.reset(null);
    this.chargerGadgetsPourLigne(index, idCategorie);
  }

  get lignes(): FormArray {
    return this.formulaire.get("lignes") as FormArray;
  }

  get type(): TypeDemande {
    return this.formulaire.get("typeDemande")!.value;
  }

  initialiserFormulaire(): void {
    this.formulaire = this.formBuilder.group({
      typeDemande: ["INTERNE", Validators.required],
      objet: ["", Validators.required],
      dateSouhaitee: [""],
      observations: [""],
      // Interne
      idService: [null],
      nombrePersonnelsImpactes: [null],
      // Externe
      structure: [""],
      representant: [""],
      telephone: [""],
      lignes: this.formBuilder.array([this.creerLigne()]),
    });
  }

  remplirFormulaire(demande: Demande): void {
    this.formulaire.patchValue({
      typeDemande: demande.typeDemande,
      objet: demande.objet,
      dateSouhaitee: demande.dateSouhaitee
        ? this.formaterDate(demande.dateSouhaitee)
        : "",
      observations: demande.observations || "",
      idService: demande.idService || null,
      nombrePersonnelsImpactes: demande.nombrePersonnelsImpactes || null,
      structure: demande.structure || "",
      representant: demande.representant || "",
      telephone: demande.telephone || "",
    });

    this.lignes.clear();
    this.gadgetsParLigne = [];

    demande.lignes.forEach((ligne, index) => {
      this.lignes.push(
        this.formBuilder.group({
          idGadget: [ligne.idGadget, Validators.required],
          quantiteDemandee: [
            ligne.quantiteDemandee,
            [Validators.required, Validators.min(1)],
          ],
          idCategorieFiltre: [null],
        }),
      );
      this.chargerGadgetsPourLigne(index, null);
    });
  }

  creerLigne(): FormGroup {
    return this.formBuilder.group({
      idGadget: [null, Validators.required],
      quantiteDemandee: [1, [Validators.required, Validators.min(1)]],
      idCategorieFiltre: [null],
    });
  }

  choisirType(type: TypeDemande): void {
    this.formulaire.get("typeDemande")!.setValue(type);
    if (type === "INTERNE") {
      this.formulaire.get("structure")!.reset();
      this.formulaire.get("representant")!.reset();
      this.formulaire.get("telephone")!.reset();
    } else {
      this.formulaire.get("idService")!.reset();
      this.formulaire.get("nombrePersonnelsImpactes")!.reset();
    }
  }

  onServiceSelected(idService: number): void {
    const service = this.servicesDisponibles.find(
      (s) => s.idService === idService,
    );
    if (service) {
    }
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

  surSelectionFichier(evenement: Event): void {
    const fichier = (evenement.target as HTMLInputElement).files?.[0];
    if (!fichier) return;
    if (fichier.size > TAILLE_MAX_OCTETS) {
      this.notification.error("Fichier trop volumineux (5 Mo maximum).");
      return;
    }
    this.fichierJustificatif = fichier;
    this.nomFichierJustificatif = fichier.name;
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      this.notification.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const valeurs = this.formulaire.value;
    const requete: DemandeRequest = {
      objet: valeurs.objet,
      typeDemande: valeurs.typeDemande,
      dateSouhaitee: valeurs.dateSouhaitee || undefined,
      observations: valeurs.observations || undefined,
      lignes: valeurs.lignes.map((l: any) => ({
        idGadget: l.idGadget,
        quantiteDemandee: l.quantiteDemandee,
      })),
    };

    if (valeurs.typeDemande === "INTERNE") {
      requete.idService = valeurs.idService;
      requete.nombrePersonnelsImpactes = valeurs.nombrePersonnelsImpactes;
    } else {
      requete.structure = valeurs.structure;
      requete.representant = valeurs.representant;
      requete.telephone = valeurs.telephone || undefined;
    }

    this.enregistrement = true;

    const operation = this.demande
      ? this.demandeService.modifier(this.demande.idDemande, requete)
      : this.demandeService.creer(requete);

    operation
      .pipe(
        switchMap((demandeCreee) => {
          if (this.fichierJustificatif) {
            return this.demandeService.televerserPieceJustificative(
              demandeCreee.idDemande,
              this.fichierJustificatif!,
            );
          }
          return of(demandeCreee);
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success("Demande enregistrée.");
          this.enregistrement = false;
          this.enregistre.emit();
        },
        error: () => {
          this.enregistrement = false;
          this.notification.error("Erreur lors de l'enregistrement");
        },
      });
  }

  getNomResponsable(idService: number | null | undefined): string {
    if (!idService) return "";
    const service = this.servicesDisponibles.find(
      (s) => s.idService === idService,
    );
    return service
      ? `${service.matriculeResponsable} - ${service.nomResponsable}`
      : "";
  }

  formaterDate(date: string | Date): string {
    if (date instanceof Date) return date.toISOString().slice(0, 10);
    return date.slice(0, 10);
  }
}
