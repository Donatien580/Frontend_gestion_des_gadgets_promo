import { Component, OnInit } from "@angular/core";
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
import { Confirmation } from "../../../shared/commun/confirmation/confirmation";
import { ConfirmationService, MenuItem } from "primeng/api";
import { Services } from "../../../core/models/service.model";
import { ServicesService } from "../servcice/services.service";
import { Message } from "primeng/message";
import { Divider } from "primeng/divider";
import { ServiceFormulaireComponent } from "./service-formulaire.component";
import { ServiceDetailComponent } from "./service-detail.component";

@Component({
  selector: "app-service-liste",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    Confirmation,
    Divider,
    CardModule,
    Message,
    TableModule,
    DialogModule,
    TooltipModule,
    BreadcrumbModule,
    InputTextModule,
    ConfirmDialogModule,
    ServiceFormulaireComponent,
    ServiceDetailComponent,
  ],
  templateUrl: "./service-liste.component.html",
  styleUrls: ["./service-liste.component.scss"],
  providers: [ConfirmationService],
})
export class ServiceListeComponent implements OnInit {
  services: Services[] = [];
  servicesFiltres: Services[] = [];
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

  // Modales
  createDialogVisible = false;
  editDialogVisible = false;
  detailDialogVisible = false;
  serviceSelectionne: Services | null = null;

  // Message de notification
  message: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    text: string;
  } | null = null;

  items: MenuItem[] = [];

  modeEdition = false;

  constructor(
    private servicesService: ServicesService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.initBreadcrumb();
    this.loadAll();
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
      { label: "Services", icon: "pi pi-building" },
    ];
  }

  loadAll(): void {
    this.isLoading = true;
    this.servicesService.lister().subscribe({
      next: (data) => {
        this.services = data;
        this.filtrer();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur chargement services :", err);
        this.isLoading = false;
        this.showMessage({
          severity: "error",
          text: "Erreur lors du chargement des services",
        });
      },
    });
  }

  filtrer(): void {
    const term = this.recherche.trim().toLowerCase();
    if (!term) {
      this.servicesFiltres = [...this.services];
    } else {
      this.servicesFiltres = this.services.filter(
        (service) =>
          service.libelleService.toLowerCase().includes(term) ||
          service.codeService.toLowerCase().includes(term) ||
          (service.nomResponsable &&
            service.nomResponsable.toLowerCase().includes(term)) ||
          (service.matriculeResponsable &&
            service.matriculeResponsable.toLowerCase().includes(term)),
      );
    }
    this.totalRecords = this.servicesFiltres.length;
    this.currentPage = 0; // revenir à la première page après filtrage
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  // Pagination PrimeNG (locale)
  changerPage(event: any): void {
    this.currentPage = event.page;
    this.recordsPerPage = event.rows;
  }

  // Actions
  openModalCreate(): void {
    this.modeEdition = false;
    this.serviceSelectionne = null;
    this.createDialogVisible = true;
  }

  openModalEdit(service: Services): void {
    this.modeEdition = true;
    this.serviceSelectionne = { ...service };
    this.editDialogVisible = true;
  }

  openModalDetail(service: Services): void {
    this.serviceSelectionne = { ...service };
    this.detailDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
    this.serviceSelectionne = null;
  }

  closeEditDialog(): void {
    this.editDialogVisible = false;
    this.serviceSelectionne = null;
  }

  closeDetailDialog(): void {
    this.detailDialogVisible = false;
    this.serviceSelectionne = null;
  }

  onServiceSaved(): void {
    this.closeCreateDialog();
    this.closeEditDialog();
    this.loadAll();
    const texte = this.modeEdition
      ? "Service modifié avec succès"
      : "Service créé avec succès";
    this.showMessage({
      severity: "success",
      text: texte,
    });
  }

  onDelete(services: Services): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le service "${services.libelleService}" ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.delete(services);
      },
    });
  }

  delete(services: Services): void {
    if (!services.idService) return;
    this.isDeleting = true;
    this.servicesService.supprimer(services.idService).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showMessage({
          severity: "success",
          text: `Service "${services.libelleService}" supprimée`,
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
