import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Inventaire } from "../../../core/models";
import { InventaireService } from "../services/inventaire.service";
import { InventaireDetailComponent } from "./inventaire-detail.component";
import { InventaireFormulaireComponent } from "./inventaire-formulaire.component";
import { NotificationService } from "../../../core/services/notification.service";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-inventaire-liste",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    DialogModule,
    TableModule,
    TooltipModule,
    InventaireDetailComponent,
    InventaireFormulaireComponent,
  ],
  templateUrl: "./inventaire-liste.component.html",
  styleUrl: "./inventaire-liste.component.scss",
})
export class InventaireListeComponent implements OnInit, OnDestroy {
  inventaires: Inventaire[] = [];
  inventaireSelectionne: Inventaire | null = null;

  isLoading = false;
  isSearching = false;

  totalRecords = 0;
  recordsPerPage = 10;
  currentPage = 0;

  recherche = "";

  createDialogVisible = false;
  detailDialogVisible = false;

  items: MenuItem[] = [];

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private inventaireService: InventaireService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.menuTool();
    this.loadAll();

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0;
        this.loadAll({ search: true });
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  menuTool(): void {
    this.items = [
      {
        label: "Accueil",
        icon: "pi pi-home",
        routerLink: ["/admin/dashboard"],
      },
      {
        label: "Inventaires",
        icon: "pi pi-clipboard",
      },
    ];
  }

  /* CONVERSION DE LA DATE */
  convertirDate(date: any): Date | null {
    if (!date) {
      return null;
    }

    if (Array.isArray(date)) {
      const [
        annee,
        mois,
        jour,
        heure = 0,
        minute = 0,
        seconde = 0,
        nanosecondes = 0,
      ] = date;

      return new Date(
        annee,
        mois - 1,
        jour,
        heure,
        minute,
        seconde,
        Math.floor(nanosecondes / 1_000_000),
      );
    }

    return new Date(date);
  }

  /* NOMBRE D'ÉCARTS */
  nombreEcarts(inventaire: Inventaire): number {
    return inventaire.lignes.filter((ligne) => ligne.ecart !== 0).length;
  }

  /* ÉTAT (libellé + classe) */
  getEtatLibelle(inventaire: Inventaire): string {
    switch (inventaire.etat) {
      case "EN_COURS":
        return "En cours";
      case "TERMINE":
        return "Terminé";
      case "VALIDE":
        return "Validé";
      default:
        return inventaire.etat;
    }
  }

  getEtatClasse(inventaire: Inventaire): string {
    switch (inventaire.etat) {
      case "EN_COURS":
        return "etiquette-alerte";
      case "TERMINE":
        return "etiquette-neutre";
      case "VALIDE":
        return "etiquette-ok";
      default:
        return "etiquette-neutre";
    }
  }

  /* CHARGEMENT DES INVENTAIRES */
  loadAll(options?: { search?: boolean }): void {
    const isSearch = options?.search ?? false;

    if (isSearch) {
      this.isSearching = true;
    } else {
      this.isLoading = true;
    }

    this.inventaireService
      .lister({
        page: this.currentPage,
        taille: this.recordsPerPage,
        recherche: this.recherche,
      })
      .subscribe({
        next: (result) => {
          this.inventaires = result.content.map((inventaire: any) => ({
            ...inventaire,
            dateInventaire: this.convertirDate(inventaire.dateInventaire),
          }));

          this.totalRecords = result.totalElements;
          this.isLoading = false;
          this.isSearching = false;
        },
        error: (error) => {
          console.error("Erreur lors du chargement des inventaires", error);
          this.notification.error("Erreur lors du chargement des inventaires.");
          this.isLoading = false;
          this.isSearching = false;
        },
      });
  }

  onSearchChange(term: string): void {
    this.recherche = term;
    this.searchSubject.next(term);
  }

  /* PAGINATION */
  changerPage(event: any): void {
    this.currentPage = event.page;
    this.recordsPerPage = event.rows;
    this.loadAll();
  }

  openModalCreate(): void {
    this.createDialogVisible = true;
  }

  openModalDetail(inventaire: Inventaire): void {
    this.inventaireSelectionne = inventaire;
    this.detailDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
  }

  /* APRÈS CRÉATION */
  onInventaireSaved(): void {
    this.createDialogVisible = false;
    this.loadAll();
  }

  /* APRÈS UNE ACTION DANS LE DÉTAIL (saisie, justification, terminer, valider) */
  onInventaireModifie(): void {
    this.loadAll();
  }

  /* FERMER MODAL DÉTAIL */
  closeDetailDialog(): void {
    this.detailDialogVisible = false;
    this.inventaireSelectionne = null;
  }
}
