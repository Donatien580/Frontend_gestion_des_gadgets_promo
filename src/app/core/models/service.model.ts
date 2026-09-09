import { Personnel } from "./personnel.model";

export interface Services {
  idService: number;
  libelleService: string;
  codeService: string;
  matriculeResponsable: string;
  nomResponsable: string;
  telephoneResponsable: string;
  personnels?: Personnel[];
}

export interface ServiceRequest {
  libelleService: string;
  codeService: string;
  matriculeResponsable?: string;
  nomResponsable?: string;
  telephoneResponsable?: string;
}
