import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemeService } from "../../../core/services/theme.service";

@Component({
  selector: "app-selecteur-theme",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./selecteur-theme.component.html",
  styleUrl: "./selecteur-theme.component.scss",
})
export class SelecteurThemeComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly ouvert = signal(false);

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  basculerPanneau(): void {
    this.ouvert.update((valeur) => !valeur);
  }

  choisir(id: string): void {
    this.themeService.definirTheme(id);
    this.ouvert.set(false);
  }

  @HostListener("document:click", ["$event"])
  protected fermerSiClicExterieur(evenement: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(evenement.target as Node)) {
      this.ouvert.set(false);
    }
  }
}
