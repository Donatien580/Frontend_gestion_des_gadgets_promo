import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "../../../core/services/theme.service";
import { NotificationService } from "../../../core/services/notification.service";
import { EnTetePageComponent } from "../../../shared/components/en-tete-page/en-tete-page.component";

@Component({
  selector: "app-parametres",
  standalone: true,
  imports: [CommonModule, FormsModule, EnTetePageComponent],
  templateUrl: "./parametres.component.html",
  styleUrl: "./parametres.component.scss",
})
export class ParametresComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly notification = inject(NotificationService);

  protected seuilAlerteDefaut = 50;
  protected emailExpediteur = "notifications@dcm.bf";
  protected notificationsActives = true;

  enregistrer(): void {
    // Pas encore d'appel API : simple confirmation visuelle pour l'instant.
    this.notification.success("Paramètres enregistrés (simulation locale).");
  }
}
