import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Personnel } from "../../../core/models/personnel.model";

@Component({
  selector: "app-personnel-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./personnel-detail.component.html",
  styleUrls: ["./personnel-detail.component.scss"],
})
export class PersonnelDetailComponent {
  @Input() personnel: Personnel | null = null;
}
