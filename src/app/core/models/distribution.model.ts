export type TypeDistribution = 'INTERNE' | 'EXTERNE';

export interface Distribution {
  idDistribution: number;
  numeroBordereau: string;
  dateDistribution: string;
  typeDistribution: TypeDistribution;
  motif?: string;
  dateSignature?: string;
  signataire?: string;
  idDemande: number;
}
