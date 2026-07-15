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
  /** The first usable image, or `null`. Kept for structured data / single-image contexts. */
  readonly image: ImageRef | null;
  /** All usable images, lowest `ordre` first, for the card carousel. */
  readonly images: readonly ImageRef[];
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

/** A social network the site links to. Matches the icon names in `IconName`. */
export type SocialReseau = 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'linkedin';

export interface SocialLinkView {
  readonly reseau: SocialReseau;
  readonly label: string;
  readonly url: string;
}

/**
 * The site's editable parameters, as the public site consumes them. Always resolved:
 * live `/parametres` values fall back to the static {@link SiteContent} field by field.
 */
export interface ParametresView {
  readonly nomEntreprise: string;
  readonly adresse: string;
  readonly telephones: readonly string[];
  /** First phone, for `tel:` links and compact displays. Never empty. */
  readonly telephone: string;
  readonly email: string;
  readonly socials: readonly SocialLinkView[];
}

/** The authenticated administrator, decoupled from the nullable `UserDetails` DTO. */
export interface UserView {
  readonly id: string;
  readonly email: string;
  /** `firstName lastName` trimmed; falls back to the email when both are absent. */
  readonly nomComplet: string;
}
