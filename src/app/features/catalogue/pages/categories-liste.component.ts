import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { Confirmation } from "../../../shared/commun/confirmation/confirmation";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MessageModule } from "primeng/message";
import { Categorie, ICategorie } from "../../../core/models";
import { CategorieService } from "../services/categorie.service";
//import { ActionsToolbar } from "../../../shared/commun/actions-toolbar/actions-toolbar";
import { DividerModule } from "primeng/divider";

@Component({
  selector: "app-categories-liste",
  standalone: true,
  imports: [
    //ActionsToolbar,
    DividerModule,
    CommonModule,
    Confirmation,
    FormsModule,
    ButtonModule,
    BreadcrumbModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    MessageModule,
    CardModule,
  ],
  providers: [ConfirmationService],
  templateUrl: "./categories-liste.component.html",
  styleUrls: ["./categories-liste.component.scss"],
})
export class CategoriesListeComponent implements OnInit {
  // Breadcru
  items: MenuItem[] = [];

  // Données
  categories: ICategorie[] = [];
  categorie: ICategorie = new Categorie();

  // Pagination (client-side)
  totalRecords = 0;
  recordsPerPage = 10;

  // États
  isLoading = false;
  isSaving = false;
  isDeleting = false;

  // Modals
  createDialogVisible = false;
  editDialogVisible = false;
  detailDialogVisible = false;

  //Boutons
  enableCreate = true;
  enableBtnInfo = true;
  enableBtnEdit = true;
  enableBtnDelete = true;
  enableBtnClose = true;

  // Message de notification
  message: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    text: string;
  } | null = null;

  constructor(
    private categorieService: CategorieService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.initBreadcrumb();
    this.loadAll();
  }

  initBreadcrumb(): void {
    this.items = [
      {
        label: "Accueil",
        icon: "pi pi-home",
        routerLink: ["/admin/dashboard"],
      },
      { label: "Paramètres", icon: "pi pi-cog" },
      { label: "Catégories", icon: "pi pi-tags" },
    ];
  }

  loadAll(): void {
    this.isLoading = true;
    this.categorieService.lister().subscribe({
      next: (data) => {
        this.categories = data;
        this.totalRecords = data.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur chargement catégories :", err);
        this.isLoading = false;
        this.showMessage({
          severity: "error",
          text: "Erreur lors du chargement des catégories",
        });
      },
    });
  }

  openModalCreate(): void {
    this.categorie = new Categorie();
    this.createDialogVisible = true;
  }

  openModalEdit(cat: ICategorie): void {
    // Copie pour ne pas modifier la ligne du tableau
    this.categorie = { ...cat };
    this.editDialogVisible = true;
  }

  openModalDetail(cat: ICategorie): void {
    this.categorie = { ...cat };
    this.detailDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
    this.categorie = new Categorie();
  }

  closeEditDialog(): void {
    this.editDialogVisible = false;
    this.categorie = new Categorie();
  }

  save(): void {
    const libelle = this.categorie.libelle?.trim();
    if (!libelle) {
      this.showMessage({
        severity: "warn",
        text: "Le libellé est obligatoire",
      });
      return;
    }

    const request = {
      libelle: libelle,
      description: this.categorie.description?.trim() || undefined,
    };

    this.isSaving = true;
    this.categorieService.creer(request).subscribe({
      next: (created) => {
        this.isSaving = false;
        this.createDialogVisible = false;
        this.showMessage({
          severity: "success",
          text: `Catégorie "${created.libelle}" créée avec succès`,
        });
        this.loadAll();
      },
      error: (err) => {
        console.error("Erreur création :", err);
        this.isSaving = false;
        this.showMessage({
          severity: "error",
          text: "Erreur lors de la création",
        });
      },
    });
  }

  update(): void {
    if (!this.categorie.idCategorie) return;
    const libelle = this.categorie.libelle?.trim();
    if (!libelle) {
      this.showMessage({
        severity: "warn",
        text: "Le libellé est obligatoire",
      });
      return;
    }

    const request = {
      libelle: libelle,
      description: this.categorie.description?.trim() || undefined,
    };

    this.isSaving = true;
    this.categorieService
      .modifier(this.categorie.idCategorie, request)
      .subscribe({
        next: (updated) => {
          this.isSaving = false;
          this.editDialogVisible = false;
          this.showMessage({
            severity: "success",
            text: `Catégorie "${updated.libelle}" mise à jour`,
          });
          this.loadAll();
        },
        error: (err) => {
          console.error("Erreur modification :", err);
          this.isSaving = false;
          this.showMessage({
            severity: "error",
            text: "Erreur lors de la modification",
          });
        },
      });
  }

  onDelete(cat: ICategorie): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la catégorie "${cat.libelle}" ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.delete(cat);
      },
    });
  }

  delete(cat: ICategorie): void {
    if (!cat.idCategorie) return;
    this.isDeleting = true;
    this.categorieService.supprimer(cat.idCategorie).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showMessage({
          severity: "success",
          text: `Catégorie "${cat.libelle}" supprimée`,
        });
        this.loadAll();
      },
      error: (err) => {
        console.error("Erreur suppression :", err);
        this.isDeleting = false;
        let msg = "Erreur lors de la suppression";
        if (err.error && err.error.message) {
          msg = err.error.message;
        }
        this.showMessage({ severity: "error", text: msg });
      },
    });
  }

  showMessage(msg: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    text: string;
  }): void {
    this.message = msg;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}
