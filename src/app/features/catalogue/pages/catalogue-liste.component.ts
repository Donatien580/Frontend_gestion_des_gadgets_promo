import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
//import { RouterLink } from "@angular/router";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { DividerModule } from "primeng/divider";
import { PaginatorModule } from "primeng/paginator";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { UrlPhotoPipe } from "../../../shared/pipes/url-photo.pipe";
import { GadgetService } from "../services/gadget.service";
import { CategorieService } from "../services/categorie.service";
import { Confirmation } from "../../../shared/commun/confirmation/confirmation";
import { Gadget, Categorie } from "../../../core/models";

import { GadgetFormulaireComponent } from "./gadget-formulaire.component";

@Component({
  selector: "app-catalogue-liste",
  standalone: true,

  imports: [
    CommonModule,
    Confirmation,
    ConfirmDialogModule,
    FormsModule,
    //RouterLink,
    UrlPhotoPipe,
    TableModule,
    ButtonModule,
    CardModule,
    BreadcrumbModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    DividerModule,
    PaginatorModule,
    CardModule,
    GadgetFormulaireComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: "./catalogue-liste.component.html",
  styleUrl: "./catalogue-liste.component.scss",
})
export class CatalogueListeComponent implements OnInit {
  gadgets: Gadget[] = [];
  categories: Categorie[] = [];
  gadget: Gadget | null = null;

  isLoading = false;
  isSaving = false;

  message: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    texte: string;
  } | null = null;

  totalRecords = 0;
  recordsPerPage = 10;
  currentPage = 0;

  recherche = "";
  idCategorieFiltre: number | null = null;
  afficherInactifs = false;

  createDialogVisible = false;
  editDialogVisible = false;
  detailDialogVisible = false;

  idGadgetEnEdition: number | null = null;

  items: MenuItem[] = [];

  constructor(
    private gadgetService: GadgetService,
    private categorieService: CategorieService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.menuTool();
    this.loadCategories();
    this.loadAll();
  }

  /*BREADCRUMB */
  menuTool(): void {
    this.items = [
      {
        label: "Accueil",
        icon: "pi pi-home",
        routerLink: ["/admin/dashboard"],
      },

      {
        label: "Catalogue",
        icon: "pi pi-box",
      },
    ];
  }

  /*CHARGER LES CATÉGORIES */
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

  /*CHARGER LES GADGETS */
  loadAll(): void {
    this.isLoading = true;

    this.gadgetService
      .lister({
        page: this.currentPage,

        taille: this.recordsPerPage,

        idCategorie: this.idCategorieFiltre,

        recherche: this.recherche,

        inclureInactifs: this.afficherInactifs,
      })
      .subscribe({
        next: (result) => {
          this.gadgets = result.content;

          this.totalRecords = result.totalElements;

          this.isLoading = false;
        },

        error: (error) => {
          console.error("Erreur lors du chargement des gadgets", error);

          this.isLoading = false;
        },
      });
  }

  /*RECHERCHE*/
  rechercher(): void {
    this.currentPage = 0;
    this.loadAll();
  }

  /* FILTRE CATÉGORIE*/
  filtrerParCategorie(): void {
    this.currentPage = 0;
    this.loadAll();
  }

  /* AFFICHER / CACHER INACTIFS */
  changerAffichageInactifs(): void {
    this.currentPage = 0;
    this.loadAll();
  }

  /* PAGINATION */
  changerPage(event: any): void {
    this.currentPage = event.page;
    this.recordsPerPage = event.rows;
    this.loadAll();
  }

  /*AJOUT*/
  openModalCreate(): void {
    this.idGadgetEnEdition = null;
    this.createDialogVisible = true;
  }

  /* MODIFICATION*/
  openModalEdit(gadget: Gadget): void {
    this.idGadgetEnEdition = gadget.idGadget;
    this.editDialogVisible = true;
  }

  /* DÉTAIL*/
  openModalDetail(gadget: Gadget): void {
    this.gadget = gadget;
    this.detailDialogVisible = true;
  }

  /* FERMER AJOUT*/
  closeCreateDialog(): void {
    this.createDialogVisible = false;
  }

  /* FERMER MODIFICATION*/
  closeEditDialog(): void {
    this.editDialogVisible = false;
  }

  /* APRÈS ENREGISTREMENT*/
  onGadgetSaved(): void {
    this.createDialogVisible = false;
    this.editDialogVisible = false;
    this.loadAll();
  }

  /* ACTIVER / DÉSACTIVER */
  changerStatut(gadget: Gadget): void {
    const activation = !gadget.actif;
    const action = activation ? "activer" : "désactiver";
    this.confirmationService.confirm({
      header: "Confirmation",
      message: `Voulez-vous vraiment ${action} le gadget « ${gadget.libelle} » ?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui! je confirme",
      rejectLabel: "Non! J'annule",
      acceptButtonStyleClass: activation
        ? "p-button-success"
        : "p-button-danger",

      rejectButtonStyleClass: "p-button-secondary",

      accept: () => {
        this.modifierStatut(gadget, activation);
      },
    });
  }

  private modifierStatut(gadget: Gadget, nouveauStatut: boolean): void {
    this.gadgetService.changerStatut(gadget.idGadget, nouveauStatut).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (error) => {
        console.error("Erreur lors du changement de statut", error);
      },
    });
  }

  /* STATUT*/
  getStatut(gadget: Gadget): string {
    if (!gadget.actif) {
      return "Inactif";
    }
    if (gadget.sousSeuilAlerte) {
      return "Alerte";
    }
    return "Disponible";
  }

  fermerFormulaire(): void {
    this.createDialogVisible = false;
    this.editDialogVisible = false;
    this.idGadgetEnEdition = null;
  }
}
