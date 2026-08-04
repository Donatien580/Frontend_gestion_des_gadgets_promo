import { Component } from '@angular/core';

@Component({
  selector: 'app-pied-de-page',
  standalone: true,
  templateUrl: './pied-de-page.component.html',
  styleUrl: './pied-de-page.component.scss',
})
export class PiedDePageComponent {
  protected readonly anneeCourante = new Date().getFullYear();
}
