import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({ providedIn: "root" })
export class NotificationService {
  constructor(private readonly messageService: MessageService) {}

  success(message: string, title = "Succès"): void {
    this.messageService.add({
      severity: "success",
      summary: title,
      detail: message,
      life: 4000,
    });
  }

  error(message: string, title = "Erreur"): void {
    this.messageService.add({
      severity: "error",
      summary: title,
      detail: message,
      life: 6000,
    });
  }

  info(message: string, title = "Information"): void {
    this.messageService.add({
      severity: "info",
      summary: title,
      detail: message,
      life: 4000,
    });
  }

  warning(message: string, title = "Attention"): void {
    this.messageService.add({
      severity: "warn",
      summary: title,
      detail: message,
      life: 5000,
    });
  }
}
