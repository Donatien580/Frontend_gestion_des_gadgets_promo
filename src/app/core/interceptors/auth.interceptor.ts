import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { KeycloakService } from "../services/keycloak.service";
import { environment } from "../../../environments/environment";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const token = keycloak.getToken();
  if (!token) {
    return next(req);
  }

  const requeteAvecToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(requeteAvecToken);
};
