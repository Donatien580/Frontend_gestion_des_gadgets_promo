import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

import { Approvisionnement } from "../../../core/models";
//import { BadgeStatutComponent } from "../../../shared/components/badge-statut/badge-statut.component";

@Component({
  selector: "app-approvisionnement-detail",
  standalone: true,

  imports: [CommonModule],

  templateUrl: "./approvisionnement-detail.component.html",
  styleUrl: "./approvisionnement-detail.component.scss",
})
export class ApprovisionnementDetailComponent {
  @Input()
  approvisionnement: Approvisionnement | null = null;

  @Input()
  chargement = false;
}
