import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  Personnel,
  PersonnelRequest,
} from "../../../core/models/personnel.model";
import { Services } from "../../../core/models/service.model";
import { PersonnelService } from "../personnels/personnel.service";
import { ServicesService } from "../../services/servcice/services.service";
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: "app-personnel-formulaire",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule],
  templateUrl: "./personnel-formulaire.component.html",
  styleUrls: ["./personnel-formulaire.component.scss"],
})
export class PersonnelFormulaireComponent implements OnInit {
  @Input() personnel: Personnel | null = null;
  @Output() enregistre = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  formulaire!: FormGroup;
  services: Services[] = [];
  enregistrement = false;

  constructor(
    private formBuilder: FormBuilder,
    private personnelService: PersonnelService,
    private servicesService: ServicesService,
  ) {
    this.initialiserFormulaire();
  }

  ngOnInit(): void {
    this.loadServices();
    if (this.personnel) {
      this.formulaire.patchValue({
        nom: this.personnel.nom,
        prenom: this.personnel.prenom,
        matricule: this.personnel.matricule,
        telephone: this.personnel.telephone,
        fonction: this.personnel.fonction,
        actif: this.personnel.actif,
        idService: this.personnel.idService,
      });
    }
  }

  initialiserFormulaire(): void {
    this.formulaire = this.formBuilder.group({
      nom: ["", Validators.required],
      prenom: [""],
      matricule: [""],
      telephone: [""],
      fonction: [""],
      actif: [true],
      idService: [null, Validators.required],
    });
  }

  loadServices(): void {
    this.servicesService.lister().subscribe((data) => {
      this.services = data;
    });
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    const requete: PersonnelRequest = this.formulaire.value;
    this.enregistrement = true;

    const operation = this.personnel
      ? this.personnelService.modifier(this.personnel.idPersonnel, requete)
      : this.personnelService.creer(requete);

    operation.subscribe({
      next: () => {
        this.enregistrement = false;
        this.enregistre.emit();
      },
      error: (err) => {
        console.error(err);
        this.enregistrement = false;
        this.enregistre.emit(); // la liste gérera l'affichage d'erreur
      },
    });
  }
}
