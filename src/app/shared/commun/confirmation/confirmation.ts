import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-confirmation",
  standalone: true,
  imports: [ButtonModule, ConfirmDialogModule, CommonModule, TooltipModule],
  templateUrl: "./confirmation.html",
  styleUrl: "./confirmation.scss",
})
export class Confirmation {}
