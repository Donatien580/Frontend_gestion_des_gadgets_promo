import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-modale",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./modale.component.html",
  styleUrl: "./modale.component.scss",
})
export class ModaleComponent implements OnChanges {
  @Input() ouverte = false;
  @Input() titre = "";
  @Input() taille: "petite" | "moyenne" | "grande" = "moyenne";
  @Input() agrandissable = false;
  @Output() fermeture = new EventEmitter<void>();

  protected readonly agrandie = signal(false);

  ngOnChanges(): void {
    document.body.style.overflow = this.ouverte ? "hidden" : "";
    if (!this.ouverte) {
      this.agrandie.set(false);
    }
  }

  @HostListener("document:keydown.escape")
  protected surToucheEchap(): void {
    if (this.ouverte) {
      this.fermer();
    }
  }

  protected basculerAgrandissement(): void {
    this.agrandie.update((valeur) => !valeur);
  }

  protected fermer(): void {
    this.fermeture.emit();
  }
}
