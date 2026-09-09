import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MenuItem } from "primeng/api";
import { Message } from "primeng/message";
import { Personnel } from "../../../core/models/personnel.model";
import { Services } from "../../../core/models/service.model";
import { PersonnelService } from "../personnels/personnel.service";
import { ServicesService } from "../../services/servcice/services.service";
import { PersonnelFormulaireComponent } from "./personnel-formulaire.component";
import { PersonnelDetailComponent } from "./personnel-detail.component";
import { DividerModule } from "primeng/divider";
import { Confirmation } from "../../../shared/commun/confirmation/confirmation";

@Component({
  selector: "app-personnel-liste",
  standalone: true,
  imports: [
    CommonModule,
    Message,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    DividerModule,
    DialogModule,
    TooltipModule,
    BreadcrumbModule,
    InputTextModule,
    ConfirmDialogModule,
    PersonnelFormulaireComponent,
    PersonnelDetailComponent,
    Confirmation,
  ],
  templateUrl: "./personnel-liste.component.html",
  styleUrls: ["./personnel-liste.component.scss"],
  providers: [ConfirmationService],
})
export class PersonnelListeComponent implements OnInit, OnDestroy {
  personnels: Personnel[] = [];
  personnelsFiltres: Personnel[] = [];
  services: Services[] = [];
  isLoading = false;
  isDeleting = false;

  // Pagination
  totalRecords = 0;
  recordsPerPage = 10;
  currentPage = 0;

  // Recherche
  recherche = "";
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Filtre par service
  serviceFiltre: number | null = null;

  // Modales
  createDialogVisible = false;
  editDialogVisible = false;
  detailDialogVisible = false;
  personnelSelectionne: Personnel | null = null;

  // Mode édition pour message
  modeEdition = false;

  // Message de notification
  message: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    text: string;
  } | null = null;

  items: MenuItem[] = [];

  constructor(
    private personnelService: PersonnelService,
    private servicesService: ServicesService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.initBreadcrumb();
    this.loadAll();
    this.loadServices();
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.recherche = term;
        this.filtrer();
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  initBreadcrumb(): void {
    this.items = [
      {
        label: "Accueil",
        icon: "pi pi-home",
        routerLink: ["/admin/dashboard"],
      },
      { label: "Paramètres", icon: "pi pi-cog" },
      { label: "Personnel", icon: "pi pi-users" },
    ];
  }

  loadAll(): void {
    this.isLoading = true;
    this.personnelService.lister().subscribe({
      next: (data) => {
        this.personnels = data.map((p: any) => ({
          ...p,
          idService: p.idservice ?? p.idService ?? p.service?.idService,
        }));
        this.filtrer();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur chargement personnel :", err);
        this.isLoading = false;
        this.showMessage({
          severity: "error",
          text: "Erreur lors du chargement du personnel",
        });
      },
    });
  }

  loadServices(): void {
    this.servicesService.lister().subscribe({
      next: (data) => {
        this.services = data;
        console.log("Services chargés:", data);
      },
      error: (err) => {
        console.log("Erreur chargement services", err);
      },
    });
  }

  /**
   * Applique la recherche et le filtre par service
   */
  filtrer(): void {
    const term = this.recherche.trim().toLowerCase();
    let result = [...this.personnels];

    if (this.serviceFiltre !== null && this.serviceFiltre !== undefined) {
      const idFiltre = Number(this.serviceFiltre);
      result = result.filter((p) => Number(p.idService) === idFiltre);
    }

    // Recherche textuelle
    if (term) {
      result = result.filter(
        (p) =>
          p.nom.toLowerCase().includes(term) ||
          p.prenom?.toLowerCase().includes(term) ||
          p.matricule?.toLowerCase().includes(term) ||
          p.fonction?.toLowerCase().includes(term) ||
          p.libelleService?.toLowerCase().includes(term),
      );
    }

    this.personnelsFiltres = result;
    this.totalRecords = this.personnelsFiltres.length;
    this.currentPage = 0;
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  onServiceFiltreChange(idService: number | null): void {
    this.serviceFiltre = idService;
    this.filtrer();
  }

  changerPage(event: any): void {
    this.currentPage = event.page;
    this.recordsPerPage = event.rows;
  }

  // Actions
  openModalCreate(): void {
    this.modeEdition = false;
    this.personnelSelectionne = null;
    this.createDialogVisible = true;
  }

  openModalEdit(personnel: Personnel): void {
    this.modeEdition = true;
    this.personnelSelectionne = { ...personnel };
    this.editDialogVisible = true;
  }

  openModalDetail(personnel: Personnel): void {
    this.personnelSelectionne = { ...personnel };
    this.detailDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
    this.personnelSelectionne = null;
  }

  closeEditDialog(): void {
    this.editDialogVisible = false;
    this.personnelSelectionne = null;
  }

  closeDetailDialog(): void {
    this.detailDialogVisible = false;
    this.personnelSelectionne = null;
  }

  onPersonnelSaved(): void {
    this.closeCreateDialog();
    this.closeEditDialog();
    this.loadAll();
    const texte = this.modeEdition
      ? "Personnel modifié avec succès"
      : "Personnel créé avec succès";
    this.showMessage({ severity: "success", text: texte });
  }

  onDelete(personnel: Personnel): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer le personnel "${personnel.nom} ${personnel.prenom}" ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.delete(personnel);
      },
    });
  }

  delete(personnel: Personnel): void {
    if (!personnel.idPersonnel) return;
    this.isDeleting = true;
    this.personnelService.supprimer(personnel.idPersonnel).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showMessage({
          severity: "success",
          text: `Personnel "${personnel.nom} ${personnel.prenom}" supprimée`,
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
