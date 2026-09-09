import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.error?.message ?? "Une erreur est survenue. Veuillez réessayer.";
      notification.error(message);
      console.error(`[HTTP ${error.status}] ${req.method} ${req.url}`, error);
      return throwError(() => error);
    }),
  );
};
