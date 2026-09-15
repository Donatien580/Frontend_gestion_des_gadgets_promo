import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { SelectModule } from "primeng/select";
import {
  Demande,
  DistributionRequest,
  Gadget,
  TypeDistribution,
} from "../../../core/models";
import { DistributionService } from "../services/distribution.service";
import { DemandeService } from "../../demandes/services/demande.service";
import { GadgetService } from "../../catalogue/services/gadget.service";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: "app-distribution-formulaire",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    SelectModule,
  ],
  templateUrl: "./distribution-formulaire.component.html",
  styleUrls: ["./distribution-formulaire.component.scss"],
})
export class DistributionFormulaireComponent implements OnInit {
  @Output() enregistre = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  formulaire!: FormGroup;
  demandesAffectees: Demande[] = [];
  gadgetsDisponibles: Gadget[] = [];
  enregistrement = false;

  suggestionsNoms: string[] = [];
  suggestionsPrenoms: string[] = [];
  suggestionsServices: string[] = [];
  suggestionsDestinataires: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private distributionService: DistributionService,
    private demandeService: DemandeService,
    private gadgetService: GadgetService,
    private notification: NotificationService,
  ) {
    this.initialiserFormulaire();
  }

  ngOnInit(): void {
    this.chargerDemandesAffectees();
    this.chargerGadgets();
  }

  get estDotation(): boolean {
    return !this.formulaire.get("idDemande")!.value;
  }

  get type(): TypeDistribution {
    return this.formulaire.get("typeDistribution")!.value;
  }

  get lignes(): FormArray {
    return this.formulaire.get("lignes") as FormArray;
  }

  initialiserFormulaire(): void {
    this.formulaire = this.formBuilder.group({
      idDemande: [null],
      typeDistribution: ["INTERNE", Validators.required],
      dateDistribution: [new Date().toISOString().slice(0, 16)],
      motif: [""],
      destinataire: [""],
      matriculeReceptionnaire: [""],
      nomReceptionnaire: [""],
      prenomReceptionnaire: [""],
      serviceReceptionnaire: [""],
      nombrePersonnes: [null],
      lignes: this.formBuilder.array([this.creerLigne()]),
    });
  }

  chargerDemandesAffectees(): void {
    this.demandeService.lister("AFFECTEE", "", 0, 100).subscribe({
      next: (page) => (this.demandesAffectees = page.content),
      error: () =>
        this.notification.error(
          "Erreur lors du chargement des demandes affectées.",
        ),
    });
  }

  chargerGadgets(): void {
    this.gadgetService.lister({ page: 0, taille: 500 }).subscribe({
      next: (page) => (this.gadgetsDisponibles = page.content),
      error: () =>
        this.notification.error("Erreur lors du chargement des gadgets."),
    });
  }

  onDemandeSelected(idDemande: number | null): void {
    const demande = this.demandesAffectees.find(
      (d) => d.idDemande === idDemande,
    );
    if (demande) {
      this.formulaire.patchValue({
        typeDistribution: demande.typeDemande,
        motif: this.formulaire.get("motif")?.value || demande.objet,
      });
    }
  }

  creerLigne(): FormGroup {
    return this.formBuilder.group({
      idGadget: [null, Validators.required],
      quantiteDistribuee: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ajouterLigne(): void {
    this.lignes.push(this.creerLigne());
  }

  retirerLigne(index: number): void {
    if (this.lignes.length > 1) {
      this.lignes.removeAt(index);
    }
  }

  stockDisponible(index: number): number | null {
    const idGadget = this.lignes.at(index).get("idGadget")?.value;
    const gadget = this.gadgetsDisponibles.find((g) => g.idGadget === idGadget);
    return gadget ? gadget.quantiteDisponible : null;
  }

  quantiteDepasseStock(index: number): boolean {
    const stock = this.stockDisponible(index);
    const quantite =
      this.lignes.at(index).get("quantiteDistribuee")?.value || 0;
    return stock !== null && quantite > stock;
  }

  rechercherNoms(event: { query: string }): void {
    this.distributionService
      .suggererNomsReceptionnaire(event.query)
      .subscribe((r) => (this.suggestionsNoms = r));
  }

  rechercherPrenoms(event: { query: string }): void {
    this.distributionService
      .suggererPrenomsReceptionnaire(event.query)
      .subscribe((r) => (this.suggestionsPrenoms = r));
  }

  rechercherServices(event: { query: string }): void {
    this.distributionService
      .suggererServicesReceptionnaire(event.query)
      .subscribe((r) => (this.suggestionsServices = r));
  }

  rechercherDestinataires(event: { query: string }): void {
    this.distributionService
      .suggererDestinataires(event.query)
      .subscribe((r) => (this.suggestionsDestinataires = r));
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      this.notification.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const valeurs = this.formulaire.getRawValue();

    if (valeurs.typeDistribution === "INTERNE" && !valeurs.nomReceptionnaire) {
      this.notification.error(
        "Le nom du réceptionnaire est obligatoire pour une distribution interne.",
      );
      return;
    }
    if (valeurs.typeDistribution === "EXTERNE" && !valeurs.destinataire) {
      this.notification.error(
        "Le destinataire est obligatoire pour une distribution externe.",
      );
      return;
    }

    for (let i = 0; i < this.lignes.length; i++) {
      if (this.quantiteDepasseStock(i)) {
        this.notification.error(
          "La quantité distribuée dépasse le stock disponible pour au moins un gadget.",
        );
        return;
      }
    }

    const requete: DistributionRequest = {
      idDemande: valeurs.idDemande || undefined,
      typeDistribution: !valeurs.idDemande
        ? valeurs.typeDistribution
        : undefined,
      dateDistribution: valeurs.dateDistribution || undefined,
      motif: valeurs.motif || undefined,
      destinataire:
        valeurs.typeDistribution === "EXTERNE"
          ? valeurs.destinataire
          : undefined,
      matriculeReceptionnaire:
        valeurs.typeDistribution === "INTERNE"
          ? valeurs.matriculeReceptionnaire
          : undefined,
      nomReceptionnaire:
        valeurs.typeDistribution === "INTERNE"
          ? valeurs.nomReceptionnaire
          : undefined,
      prenomReceptionnaire:
        valeurs.typeDistribution === "INTERNE"
          ? valeurs.prenomReceptionnaire
          : undefined,
      serviceReceptionnaire:
        valeurs.typeDistribution === "INTERNE"
          ? valeurs.serviceReceptionnaire
          : undefined,
      nombrePersonnes:
        valeurs.typeDistribution === "INTERNE"
          ? valeurs.nombrePersonnes
          : undefined,
      lignes: valeurs.lignes.map((l: any) => ({
        idGadget: l.idGadget,
        quantiteDistribuee: l.quantiteDistribuee,
      })),
    };

    this.enregistrement = true;
    this.distributionService.creer(requete).subscribe({
      next: () => {
        this.notification.success("Distribution créée.");
        this.enregistrement = false;
        this.enregistre.emit();
      },
      error: (erreur) => {
        this.enregistrement = false;
        this.notification.error(
          erreur?.error?.message ||
            "Erreur lors de la création de la distribution.",
        );
      },
    });
  }
}
