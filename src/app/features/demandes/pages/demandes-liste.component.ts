import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  AgentResume,
  Demande,
  EtatDemande,
  PageResponse,
} from "../../../core/models";
import { DemandeService } from "../services/demande.service";
import { MenuItem } from "primeng/api";
import { TableModule } from "primeng/table";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { DemandeFormulaireComponent } from "./demande-formulaire.component";
import { DemandeDetailComponent } from "./demande-detail.component";
import { MessageModule } from "primeng/message";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: "app-demandes-liste",
  imports: [
    TableModule,
    ButtonModule,
    TooltipModule,
    CommonModule,
    FormsModule,
    MessageModule,
    CardModule,
    BreadcrumbModule,
    DemandeDetailComponent,
    DemandeFormulaireComponent,
    DialogModule,
  ],
  templateUrl: "./demandes-liste.component.html",
  styleUrls: ["./demandes-liste.component.scss"],
})
export class DemandesListeComponent implements OnInit, OnDestroy {
  demandes: Demande[] = [];
  isLoading = false;
  recherche = "";
  etatFiltre: EtatDemande | null = null;

  totalRecords = 0;
  recordsPerPage = 10;
  currentPage = 0;

  formulaireVisible = false;
  demandeAEditer: Demande | null = null;
  detailVisible = false;
  demandeDetail: Demande | null = null;

  /* AFFECTATION (Chef Département — vérifié côté backend tant que Keycloak n'est pas branché) */
  affectationVisible = false;
  demandeAAffecter: Demande | null = null;
  agentsAffectables: AgentResume[] = [];
  idAgentSelectionne: number | null = null;
  affectationEnCours = false;

  items: MenuItem[] = [];

  message: {
    severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast";
    text: string;
  } | null = null;

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  etatsDisponibles = [
    { valeur: "EN_ATTENTE", libelle: "En attente" },
    { valeur: "VALIDEE_CHEF_DEPARTEMENT", libelle: "Validée" },
    { valeur: "AFFECTEE", libelle: "Affectée" },
    { valeur: "TRAITEE", libelle: "Traitée" },
    { valeur: "REFUSEE", libelle: "Refusée" },
    { valeur: "ANNULEE", libelle: "Annulée" },
  ];

  constructor(
    private demandeService: DemandeService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.menuTool();
    this.loadAll();
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0;
        this.loadAll();
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
      { label: "Demandes", icon: "pi pi-file" },
    ];
  }

  loadAll(): void {
    this.isLoading = true;
    this.demandeService
      .lister(
        this.etatFiltre,
        this.recherche,
        this.currentPage,
        this.recordsPerPage,
      )
      .subscribe({
        next: (page: PageResponse<Demande>) => {
          this.demandes = page.content.map((d) => ({
            ...d,
            dateDemande: this.convertirDate(d.dateDemande) ?? new Date(0),
            dateValidation: d.dateValidation
              ? (this.convertirDate(d.dateValidation) ?? undefined)
              : undefined,
          }));
          this.totalRecords = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.showMessage({
            severity: "error",
            text: "Erreur lors du chargement des demandes",
          });
        },
      });
  }

  onSearch(term: string): void {
    this.recherche = term.trim();
    this.searchSubject.next(this.recherche);
  }

  onFiltreChange(etat: EtatDemande | null): void {
    this.etatFiltre = etat;
    this.currentPage = 0;
    this.loadAll();
  }

  changerPage(event: any): void {
    this.currentPage = event.page;
    this.recordsPerPage = event.rows;
    this.loadAll();
  }

  convertirDate(date: any): Date | null {
    if (!date) return null;
    if (Array.isArray(date)) {
      const [y, m, d, h = 0, min = 0, s = 0] = date;
      return new Date(y, m - 1, d, h, min, s);
    }
    return new Date(date);
  }

  /* CRÉATION / MODIFICATION */
  ouvrirCreation(): void {
    this.demandeAEditer = null;
    this.formulaireVisible = true;
  }

  ouvrirModification(demande: Demande): void {
    if (demande.etat !== "EN_ATTENTE") {
      this.showMessage({
        severity: "warn",
        text: "Cette demande ne peut plus être modifiée.",
      });
      return;
    }
    this.demandeAEditer = demande;
    this.formulaireVisible = true;
  }

  fermerFormulaire(): void {
    this.formulaireVisible = false;
    this.demandeAEditer = null;
  }

  onDemandeEnregistree(): void {
    const etaitEnModification = !!this.demandeAEditer;
    this.fermerFormulaire();
    this.loadAll();
    this.showMessage({
      severity: "success",
      text: etaitEnModification
        ? "Demande modifiée avec succès"
        : "Demande créée avec succès",
    });
  }

  /* DÉTAIL */
  ouvrirDetail(demande: Demande): void {
    this.demandeDetail = demande;
    this.detailVisible = true;
  }

  fermerDetail(): void {
    this.detailVisible = false;
    this.demandeDetail = null;
  }

  /* AFFECTATION */
  ouvrirAffectation(demande: Demande): void {
    if (demande.etat !== "VALIDEE_CHEF_DEPARTEMENT") {
      this.showMessage({
        severity: "warn",
        text: "La demande doit d'abord être validée.",
      });
      return;
    }
    this.demandeAAffecter = demande;
    this.idAgentSelectionne = null;
    this.affectationVisible = true;
    this.demandeService.listerAgentsAffectables().subscribe({
      next: (agents) => (this.agentsAffectables = agents),
      error: () =>
        this.notification.error("Erreur lors du chargement des agents."),
    });
  }

  fermerAffectation(): void {
    this.affectationVisible = false;
    this.demandeAAffecter = null;
  }

  confirmerAffectation(): void {
    if (!this.demandeAAffecter || !this.idAgentSelectionne) return;

    this.affectationEnCours = true;
    this.demandeService
      .affecter(this.demandeAAffecter.idDemande, {
        idAgentAffecte: this.idAgentSelectionne,
      })
      .subscribe({
        next: () => {
          this.affectationEnCours = false;
          this.fermerAffectation();
          this.loadAll();
          this.showMessage({
            severity: "success",
            text: "Demande affectée avec succès.",
          });
        },
        error: (erreur) => {
          this.affectationEnCours = false;
          // Message backend explicite si l'utilisateur courant n'a pas le rôle Chef Département
          this.notification.error(
            erreur?.error?.message || "Erreur lors de l'affectation.",
          );
        },
      });
  }

  /* AIDE STATUTS */
  getEtatLibelle(etat: EtatDemande): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "En attente";
      case "VALIDEE_CHEF_DEPARTEMENT":
        return "Validée";
      case "AFFECTEE":
        return "Affectée";
      case "TRAITEE":
        return "Traitée";
      case "REFUSEE":
        return "Refusée";
      case "ANNULEE":
        return "Annulée";
      default:
        return "Inconnu";
    }
  }

  getEtatClasse(etat: EtatDemande): string {
    switch (etat) {
      case "EN_ATTENTE":
        return "statut-attente";
      case "VALIDEE_CHEF_DEPARTEMENT":
        return "statut-valide";
      case "AFFECTEE":
        return "statut-affectee";
      case "TRAITEE":
        return "statut-traitee";
      case "REFUSEE":
        return "statut-refusee";
      case "ANNULEE":
        return "statut-annulee";
      default:
        return "";
    }
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
