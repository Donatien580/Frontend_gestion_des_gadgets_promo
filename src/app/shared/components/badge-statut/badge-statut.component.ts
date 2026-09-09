import { Component, Input, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-badge-statut",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./badge-statut.component.html",
  styleUrl: "./badge-statut.component.scss",
})
export class BadgeStatutComponent {
  private readonly etatInterne = signal<string>("");

  @Input({ required: true })
  set etat(valeur: string) {
    this.etatInterne.set(valeur);
  }

  private static readonly LIBELLES: Record<string, string> = {
    EN_ATTENTE: "En attente",
    VALIDEE_CHEF_DEPARTEMENT: "Validée",
    AFFECTEE: "Affectée",
    REFUSEE: "Refusée",
    ANNULEE: "Annulée",
    TRAITEE: "Traitée",
    EN_COURS: "En cours",
    TERMINE: "Terminé",
    VALIDE: "Validé",
    RESOLU: "Résolu",
    DISPONIBLE: "Disponible",
    MANQUANT: "Manquant",
    ENDOMMAGE: "Endommagé",
    ACTIF: "Actif",
    INACTIF: "Inactif",
  };

  private static readonly TONS: Record<string, string> = {
    EN_ATTENTE: "ton-attention",
    VALIDEE_CHEF_DEPARTEMENT: "ton-info",
    AFFECTEE: "ton-info",
    REFUSEE: "ton-danger",
    ANNULEE: "ton-neutre",
    TRAITEE: "ton-succes",
    EN_COURS: "ton-attention",
    TERMINE: "ton-info",
    VALIDE: "ton-succes",
    RESOLU: "ton-succes",
    DISPONIBLE: "ton-succes",
    MANQUANT: "ton-danger",
    ENDOMMAGE: "ton-attention",
    ACTIF: "ton-succes",
    INACTIF: "ton-neutre",
  };

  protected readonly libelleAffiche = computed(
    () =>
      BadgeStatutComponent.LIBELLES[this.etatInterne()] ?? this.etatInterne(),
  );

  protected readonly tonAffiche = computed(
    () => BadgeStatutComponent.TONS[this.etatInterne()] ?? "ton-neutre",
  );
}
