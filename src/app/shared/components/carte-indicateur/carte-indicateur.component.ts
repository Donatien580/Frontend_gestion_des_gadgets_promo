import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Tendance = 'hausse' | 'baisse' | 'neutre';

/**
 * Composant de présentation pur (dumb component) : reçoit tout via @Input,
 * aucune injection de service, réutilisable sur n'importe quel écran de KPI.
 */
@Component({
  selector: 'app-carte-indicateur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carte-indicateur.component.html',
  styleUrl: './carte-indicateur.component.scss',
})
export class CarteIndicateurComponent {
  @Input({ required: true }) libelle!: string;
  @Input({ required: true }) valeur!: string | number;
  @Input() icone = 'pi pi-chart-line';
  @Input() tendance: Tendance = 'neutre';
  @Input() libelleTendance = '';
  @Input() accent: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
}
