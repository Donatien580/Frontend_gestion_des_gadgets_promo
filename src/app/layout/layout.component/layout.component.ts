import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { DrawerModule } from "primeng/drawer";
import { MenuLateralComponent } from "../menu-lateral/menu-lateral.component";
import { EnTeteComponent } from "../en-tete/en-tete.component";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, DrawerModule, MenuLateralComponent, EnTeteComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  drawerVisible = false;
}
