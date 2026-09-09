import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Approvisionnement } from "../../../core/models";
import { ApprovisionnementService } from "../services/approvisionnement.service";
import { ApprovisionnementFormulaireComponent } from "./approvisionnement-formulaire.component";
import { ApprovisionnementDetailComponent } from "./approvisionnement-detail.component";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-approvisionnements-liste",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    DialogModule,
    TableModule,
    ApprovisionnementFormulaireComponent,
    ApprovisionnementDetailComponent,
  ],
  templateUrl: "./approvisionnements-liste.component.html",
  styleUrl: "./approvisionnements-liste.component.scss",
})
export class ApprovisionnementsListeComponent implements OnInit, OnDestroy {
  approvisionnements: Approvisionnement[] = [];
  approvisionnementSelectionne: Approvisionnement | null = null;

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

  constructor(private approvisionnementService: ApprovisionnementService) {}

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
        label: "Approvisionnement",
        icon: "pi pi-box",
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

  /* NOMBRE DE GADGETS DÉFECTUEUX */
  nombreDefectueux(approvisionnement: Approvisionnement): number {
    return approvisionnement.lignes.reduce(
      (total, ligne) => total + (ligne.quantiteDefectueuse ?? 0),
      0,
    );
  }

  /* QUALITÉ */
  getQualite(approvisionnement: Approvisionnement): string {
    const totalDefectueux = this.nombreDefectueux(approvisionnement);

    if (approvisionnement.lignes.length === 0) {
      return "Non évalué";
    }

    if (totalDefectueux === 0) {
      return "Conforme";
    }

    if (totalDefectueux === approvisionnement.lignes.length) {
      return "Tous défectueux";
    }

    return `${totalDefectueux} défectueux`;
  }

  getQualiteClasse(approvisionnement: Approvisionnement): string {
    const totalDefectueux = this.nombreDefectueux(approvisionnement);

    if (approvisionnement.lignes.length === 0) {
      return "etiquette-neutre";
    }

    if (totalDefectueux === 0) {
      return "etiquette-ok";
    }

    if (totalDefectueux === approvisionnement.lignes.length) {
      return "etiquette-danger";
    }

    return "etiquette-alerte";
  }

  /* CHARGEMENT DES APPROVISIONNEMENTS */
  loadAll(options?: { search?: boolean }): void {
    const isSearch = options?.search ?? false;

    if (isSearch) {
      this.isSearching = true;
    } else {
      this.isLoading = true;
    }

    this.approvisionnementService
      .lister({
        page: this.currentPage,
        taille: this.recordsPerPage,
        recherche: this.recherche,
      })
      .subscribe({
        next: (result) => {
          this.approvisionnements = result.content.map(
            (approvisionnement: any) => ({
              ...approvisionnement,
              dateReception: this.convertirDate(
                approvisionnement.dateReception,
              ),
            }),
          );

          this.totalRecords = result.totalElements;
          this.isLoading = false;
          this.isSearching = false;
        },
        error: (error) => {
          console.error(
            "Erreur lors du chargement des approvisionnements",
            error,
          );
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

  openModalDetail(approvisionnement: Approvisionnement): void {
    this.approvisionnementSelectionne = approvisionnement;
    this.detailDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
  }

  /* APRÈS ENREGISTREMENT */
  onApprovisionnementSaved(): void {
    this.createDialogVisible = false;
    this.loadAll();
  }

  /* FERMER MODAL DÉTAIL */
  closeDetailDialog(): void {
    this.detailDialogVisible = false;
    this.approvisionnementSelectionne = null;
  }
}
