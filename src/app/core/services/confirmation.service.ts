import { Injectable, signal } from "@angular/core";

export interface DemandeConfirmation {
  titre: string;
  message: string;
  libelleConfirmer?: string;
  libelleAnnuler?: string;
  dangereux?: boolean;
}
@Injectable({ providedIn: "root" })
export class ConfirmationService {
  readonly demande = signal<DemandeConfirmation | null>(null);
  private resolveur: ((confirme: boolean) => void) | null = null;

  confirmer(demande: DemandeConfirmation): Promise<boolean> {
    this.demande.set(demande);
    return new Promise<boolean>((resolve) => {
      this.resolveur = resolve;
    });
  }

  repondre(confirme: boolean): void {
    this.demande.set(null);
    this.resolveur?.(confirme);
    this.resolveur = null;
  }
}
