import type { DayOfWeek } from '../api/models';

/** A resolvable image with a stable key for re-signing and a ready-to-use alt text. */
export interface ImageRef {
  readonly url: string;
  /** MinIO object key; used to re-sign an expired presigned URL. */
  readonly objectKey: string | null;
  /** Empty string means "decorative" — render `alt="" aria-hidden`. */
  readonly alt: string;
}

export interface ServiceView {
  readonly id: string;
  readonly nom: string;
  readonly description: string;
  readonly avantages: readonly string[];
  readonly image: ImageRef | null;
  readonly ordre: number;
}

export interface RealisationView {
  readonly id: string;
  readonly titre: string;
  readonly description: string;
  readonly categorie: string | null;
  /** ISO date string, or `null` when absent. */
  readonly date: string | null;
  readonly image: ImageRef | null;
}

export interface HoraireView {
  readonly jour: DayOfWeek;
  readonly libelle: string;
  readonly ferme: boolean;
  /** e.g. `'09:00 – 18:00'`, or `null` when closed. */
  readonly plage: string | null;
}
