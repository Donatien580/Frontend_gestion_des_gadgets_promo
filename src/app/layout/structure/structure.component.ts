import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MenuLateralComponent } from "../menu-lateral/menu-lateral.component";
import { EnTeteComponent } from "../en-tete/en-tete.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { FilArianeComponent } from "../../shared/components/fil-ariane/fil-ariane.component";

/**
 * Ossature visuelle commune à tout l'espace applicatif
 */
@Component({
  selector: "app-structure",
  standalone: true,
  imports: [
    RouterOutlet,
    MenuLateralComponent,
    EnTeteComponent,
    PiedDePageComponent,
    FilArianeComponent,
  ],
  templateUrl: "./structure.component.html",
  styleUrl: "./structure.component.scss",
})
export class StructureComponent {}
