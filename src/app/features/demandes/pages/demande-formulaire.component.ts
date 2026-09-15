import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { of, switchMap } from "rxjs";
import { DemandeService } from "../services/demande.service";
import { CardModule } from "primeng/card";
import { NotificationService } from "../../../core/services/notification.service";
import { Demande, DemandeRequest, TypeDemande } from "../../../core/models";
import { FieldsetModule } from "primeng/fieldset";
import { AutoCompleteModule } from "primeng/autocomplete";

const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

@Component({
  selector: "app-demande-formulaire",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    FieldsetModule,
    AutoCompleteModule,
  ],
  templateUrl: "./demande-formulaire.component.html",
  styleUrls: ["./demande-formulaire.component.scss"],
})
export class DemandeFormulaireComponent implements OnInit {
  @Input() demande: Demande | null = null;
  @Output() enregistre = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  enregistrement = false;

  fichierJustificatif: File | null = null;
  nomFichierJustificatif = "";

  formulaire!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private demandeService: DemandeService,
    private notification: NotificationService,
  ) {
    this.initialiserFormulaire();
  }

  ngOnInit(): void {
    if (this.demande) {
      this.remplirFormulaire(this.demande);
    }
  }

  suggestionsNoms: string[] = [];
  suggestionsPrenoms: string[] = [];
  suggestionsServices: string[] = [];
  suggestionsStructures: string[] = [];

  rechercherNoms(event: { query: string }): void {
    this.demandeService
      .suggererNoms(event.query)
      .subscribe((resultats) => (this.suggestionsNoms = resultats));
  }

  rechercherPrenoms(event: { query: string }): void {
    this.demandeService
      .suggererPrenoms(event.query)
      .subscribe((resultats) => (this.suggestionsPrenoms = resultats));
  }

  rechercherServices(event: { query: string }): void {
    this.demandeService
      .suggererServices(event.query)
      .subscribe((resultats) => (this.suggestionsServices = resultats));
  }

  rechercherStructures(event: { query: string }): void {
    this.demandeService
      .suggererStructures(event.query)
      .subscribe((resultats) => (this.suggestionsStructures = resultats));
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
      nomDemandeur: ["", Validators.required],
      prenomDemandeur: [""],
      telephoneDemandeur: [""],
      // Interne
      matriculeDemandeur: [""],
      serviceDemandeur: [""],
      // Externe
      structureDemandeur: [""],
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
      nomDemandeur: demande.nomDemandeur,
      prenomDemandeur: demande.prenomDemandeur || "",
      telephoneDemandeur: demande.telephoneDemandeur || "",
      matriculeDemandeur: demande.matriculeDemandeur || "",
      serviceDemandeur: demande.serviceDemandeur || "",
      structureDemandeur: demande.structureDemandeur || "",
    });
  }

  choisirType(type: TypeDemande): void {
    this.formulaire.get("typeDemande")!.setValue(type);
    if (type === "INTERNE") {
      this.formulaire.get("structureDemandeur")!.reset("");
    } else {
      this.formulaire.get("matriculeDemandeur")!.reset("");
      this.formulaire.get("serviceDemandeur")!.reset("");
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

    if (valeurs.typeDemande === "INTERNE") {
      if (!valeurs.matriculeDemandeur || !valeurs.serviceDemandeur) {
        this.notification.error(
          "Le matricule et le service du demandeur sont obligatoires.",
        );
        return;
      }
    } else if (!valeurs.structureDemandeur) {
      this.notification.error(
        "La structure est obligatoire pour une demande externe.",
      );
      return;
    }

    const requete: DemandeRequest = {
      objet: valeurs.objet,
      typeDemande: valeurs.typeDemande,
      dateSouhaitee: valeurs.dateSouhaitee || undefined,
      observations: valeurs.observations || undefined,
      nomDemandeur: valeurs.nomDemandeur,
      prenomDemandeur: valeurs.prenomDemandeur || undefined,
      telephoneDemandeur: valeurs.telephoneDemandeur || undefined,
      matriculeDemandeur:
        valeurs.typeDemande === "INTERNE"
          ? valeurs.matriculeDemandeur
          : undefined,
      serviceDemandeur:
        valeurs.typeDemande === "INTERNE"
          ? valeurs.serviceDemandeur
          : undefined,
      structureDemandeur:
        valeurs.typeDemande === "EXTERNE"
          ? valeurs.structureDemandeur
          : undefined,
    };

    this.enregistrement = true;

    const operation = this.demande
      ? this.demandeService.modifier(this.demande.idDemande, requete)
      : this.demandeService.creer(requete);

    operation
      .pipe(
        switchMap((demandeEnregistree) => {
          if (this.fichierJustificatif) {
            return this.demandeService.televerserPieceJustificative(
              demandeEnregistree.idDemande,
              this.fichierJustificatif!,
            );
          }
          return of(demandeEnregistree);
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
          this.notification.error("Erreur lors de l'enregistrement.");
        },
      });
  }

  formaterDate(date: string | Date): string {
    if (date instanceof Date) return date.toISOString().slice(0, 10);
    return date.slice(0, 10);
  }
}
