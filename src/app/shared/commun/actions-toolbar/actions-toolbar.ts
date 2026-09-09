import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-actions-toolbar",
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: "./actions-toolbar.html",
  styleUrl: "./actions-toolbar.scss",
})
export class ActionsToolbar implements OnInit {
  @Input() enableBtnInfo: boolean = false;
  @Input() enableBtnEdit: boolean = false;
  @Input() enableBtnDelete: boolean = false;
  @Input() enableBtnPrivilege: boolean = false;
  @Input() enableBtnClose: boolean = false;
  @Input() enableBtnEmail: boolean = false;
  @Input() enableBtnTreat: boolean = false;
  @Input() enableBtnEval: boolean = false;
  @Input() enableBtnChanger: boolean = false;
  @Input() enableBtnTelecharger: boolean = false;
  @Input() enableBtnDossier: boolean = false;
  @Input() enableBtnCircuit: boolean = false;

  @Output() info: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() privilege: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() email: EventEmitter<any> = new EventEmitter();
  @Output() treat: EventEmitter<any> = new EventEmitter();
  @Output() evaluer: EventEmitter<any> = new EventEmitter();
  @Output() changer: EventEmitter<any> = new EventEmitter();
  @Output() telecharger: EventEmitter<any> = new EventEmitter();
  @Output() dossier: EventEmitter<any> = new EventEmitter();
  @Output() circuit: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  fireInfo() {
    this.info.emit();
  }

  fireEdit() {
    this.edit.emit();
  }

  fireDelete() {
    this.delete.emit();
  }

  firePrivilege() {
    this.privilege.emit();
  }
  fireClose() {
    this.close.emit();
  }
  fireEmail() {
    this.email.emit();
  }

  fireTreat() {
    this.treat.emit();
  }
  fireEvaluer() {
    this.evaluer.emit();
  }
  fireChanger() {
    this.changer.emit();
  }
  fireTelecharger() {
    this.telecharger.emit();
  }
  fireDossier() {
    this.dossier.emit();
  }
  fireCircuit() {
    this.circuit.emit();
  }
}
