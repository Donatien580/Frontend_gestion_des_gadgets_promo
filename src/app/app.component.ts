import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Toast } from "primeng/toast";
import { BoiteConfirmationComponent } from "./shared/components/boite-confirmation/boite-confirmation.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, Toast, BoiteConfirmationComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "frontend";
}
