import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Services } from "../../../core/models/service.model";

@Component({
  selector: "app-service-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./service-detail.component.html",
  styleUrls: ["./service-detail.component.scss"],
})
export class ServiceDetailComponent {
  @Input() service: Services | null = null;
}
