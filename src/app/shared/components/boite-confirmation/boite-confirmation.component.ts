import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfirmationService } from "../../../core/services/confirmation.service";
import { ModaleComponent } from "../modale/modale.component";

@Component({
  selector: "app-boite-confirmation",
  standalone: true,
  imports: [CommonModule, ModaleComponent],
  templateUrl: "./boite-confirmation.component.html",
})
export class BoiteConfirmationComponent {
  protected readonly confirmationService = inject(ConfirmationService);

  protected repondre(confirme: boolean): void {
    this.confirmationService.repondre(confirme);
  }
}
