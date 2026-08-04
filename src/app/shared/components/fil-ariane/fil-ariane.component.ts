import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

export interface SegmentFilAriane {
  libelle: string;
  route?: string;
}

/**
 * Affiche automatiquement le chemin de la page courante (ex : "Demandes >
 * Nouvelle demande"), lu depuis la propriété `data.filAriane` déclarée sur
 * chaque route dans app.routes.ts. Monté une seule fois dans
 * StructureComponent : aucune page n'a besoin de l'ajouter manuellement.
 */
@Component({
  selector: 'app-fil-ariane',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fil-ariane.component.html',
  styleUrl: './fil-ariane.component.scss',
})
export class FilArianeComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly segments = signal<SegmentFilAriane[]>([]);

  constructor() {
    this.construire();

    this.router.events
      .pipe(
        filter((evenement) => evenement instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.construire());
  }

  private construire(): void {
    let snapshot = this.router.routerState.snapshot.root;
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    this.segments.set((snapshot.data['filAriane'] as SegmentFilAriane[]) ?? []);
  }
}
