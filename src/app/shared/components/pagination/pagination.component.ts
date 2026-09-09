import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
})
export class PaginationComponent {
  @Input({ required: true }) pageCourante!: number; // 0-indexée
  @Input({ required: true }) totalPages!: number;
  @Input({ required: true }) totalElements!: number;
  @Input() taillePage = 20;
  @Input() optionsTaille: number[] = [10, 20, 50];

  @Output() pageChangee = new EventEmitter<number>();
  @Output() tailleChangee = new EventEmitter<number>();

  protected get debut(): number {
    return this.totalElements === 0
      ? 0
      : this.pageCourante * this.taillePage + 1;
  }

  protected get fin(): number {
    return Math.min(
      (this.pageCourante + 1) * this.taillePage,
      this.totalElements,
    );
  }

  allerA(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.pageCourante)
      return;
    this.pageChangee.emit(page);
  }

  surChangementTaille(nouvelleTaille: number): void {
    this.tailleChangee.emit(Number(nouvelleTaille));
  }
}
