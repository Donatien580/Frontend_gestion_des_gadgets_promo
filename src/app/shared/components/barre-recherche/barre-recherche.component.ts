import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DestroyRef, inject } from "@angular/core";

@Component({
  selector: "app-barre-recherche",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./barre-recherche.component.html",
  styleUrl: "./barre-recherche.component.scss",
})
export class BarreRechercheComponent {
  @Input() placeholder = "Rechercher…";
  @Output() recherche = new EventEmitter<string>();

  protected valeur = "";

  private readonly saisie$ = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.saisie$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((texte) => this.recherche.emit(texte));
  }

  surSaisie(texte: string): void {
    this.valeur = texte;
    this.saisie$.next(texte.trim());
  }

  effacer(): void {
    this.valeur = "";
    this.saisie$.next("");
  }
}
