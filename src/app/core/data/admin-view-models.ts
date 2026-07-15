import type { DayOfWeek } from '../api/models';
import type { ImageRef } from './view-models';

/** A gallery image in the back-office: keeps its id and order for edit/reorder/delete. */
export interface AdminImage {
  readonly id: string;
  readonly objectKey: string | null;
  readonly ordre: number;
  /** Ready-to-render `ImageRef` for `<app-remote-image>` (re-signs expired URLs). */
  readonly ref: ImageRef;
}

/** A service as the back-office sees it: full data, including hidden fields and every image. */
export interface ServiceAdminView {
  readonly id: string;
  readonly nom: string;
  readonly description: string;
  readonly avantages: readonly string[];
  readonly ordre: number;
  readonly visible: boolean;
  readonly images: readonly AdminImage[];
  readonly updatedAt: string | null;
}

export interface RealisationAdminView {
  readonly id: string;
  readonly titre: string;
  readonly description: string;
  readonly categorie: string;
  /** ISO date string, or `null` when absent. */
  readonly dateRealisation: string | null;
  readonly visible: boolean;
  readonly images: readonly AdminImage[];
  readonly updatedAt: string | null;
}

/** The site parameters as the back-office edits them: raw stored values, empty string for null. */
export interface ParametresAdminView {
  readonly nomEntreprise: string;
  readonly adresse: string;
  readonly telephones: readonly string[];
  /** Read-only: not part of `UpdateParametres`. */
  readonly email: string;
  /** Read-only: managed outside this endpoint. */
  readonly logo: string | null;
  readonly facebook: string;
  readonly instagram: string;
  readonly whatsApp: string;
  readonly tikTok: string;
  readonly updatedAt: string | null;
}

export interface HoraireAdminView {
  readonly id: string;
  readonly jour: DayOfWeek;
  readonly libelle: string;
  readonly ferme: boolean;
  /** `HH:mm`, or `null`. */
  readonly heureOuverture: string | null;
  /** `HH:mm`, or `null`. */
  readonly heureFermeture: string | null;
  readonly visible: boolean;
}
