import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Transforme un chemin relatif stocké en base (ex: "gadgets/uuid.jpg") en URL
 * complète vers le fichier servi par le backend (cf. WebConfig côté Spring,
 * qui expose le dossier d'upload sous /uploads/**).
 *
 * Utilisation : <img [src]="gadget.photoGadget | urlPhoto" />
 */
@Pipe({ name: 'urlPhoto', standalone: true })
export class UrlPhotoPipe implements PipeTransform {
  transform(cheminRelatif: string | null | undefined): string | null {
    if (!cheminRelatif) return null;
    return `${environment.baseUrl}/uploads/${cheminRelatif}`;
  }
}
