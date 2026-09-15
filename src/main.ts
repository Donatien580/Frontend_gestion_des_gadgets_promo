import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { KeycloakService } from "./app/core/services/keycloak.service";

const keycloakService = new KeycloakService();
keycloakService.init(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
  );
});
