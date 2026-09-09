import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Services, ServiceRequest } from "../../../core/models/service.model";
import { ServicesService } from "../servcice/services.service";

@Component({
  selector: "app-service-formulaire",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./service-formulaire.component.html",
  styleUrls: ["./service-formulaire.component.scss"],
})
export class ServiceFormulaireComponent implements OnInit {
  @Input() service: Services | null = null; // null = création
  @Output() enregistre = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  formulaire!: FormGroup;
  enregistrement = false;

  constructor(
    private formBuilder: FormBuilder,
    private servicesService: ServicesService,
  ) {
    this.initialiserFormulaire();
  }

  ngOnInit(): void {
    if (this.service) {
      this.formulaire.patchValue({
        libelleService: this.service.libelleService,
        codeService: this.service.codeService,
        matriculeResponsable: this.service.matriculeResponsable,
        nomResponsable: this.service.nomResponsable,
        telephoneResponsable: this.service.telephoneResponsable,
      });
    }
  }

  initialiserFormulaire(): void {
    this.formulaire = this.formBuilder.group({
      libelleService: ["", Validators.required],
      codeService: ["", Validators.required],
      matriculeResponsable: [""],
      nomResponsable: [""],
      telephoneResponsable: [""],
    });
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    const requete: ServiceRequest = this.formulaire.value;
    this.enregistrement = true;

    const operation = this.service
      ? this.servicesService.modifier(this.service.idService, requete)
      : this.servicesService.creer(requete);

    operation.subscribe({
      next: () => {
        this.enregistrement = false;
        this.enregistre.emit();
      },
      error: (err) => {
        console.error(err);
        this.enregistrement = false;
        // L'erreur sera gérée par le parent via un message
        this.enregistre.emit();
      },
    });
  }
}
