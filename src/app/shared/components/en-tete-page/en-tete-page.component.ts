import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IDENTITES_MODULES } from "../../constantes/identites-modules";

@Component({
  selector: "app-en-tete-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./en-tete-page.component.html",
  styleUrl: "./en-tete-page.component.scss",
})
export class EnTetePageComponent {
  @Input({ required: true }) module!: string;
  @Input() sousTitre = "";

  protected get identite() {
    return IDENTITES_MODULES[this.module];
  }
}
