import type { DayOfWeek } from '../api/models';

/** A navigation link used by the header bar, the mobile drawer and the footer. */
export interface NavLink {
  readonly path: string;
  readonly label: string;
  readonly exact: boolean;
}

export interface HeroContent {
  readonly titre: string;
  readonly slogan: string;
  /** Static image under `public/`, or `null` to fall back to the brand gradient. */
  readonly image: string | null;
  /** Animated `.glb` model under `public/`, or `null` to hide it. */
  readonly model: string | null;
  readonly ctaPrimary: NavLink;
  readonly ctaSecondary: NavLink;
}

export interface StatItem {
  /** Kept as a string so Latin digits/plus signs render verbatim in `dir="ltr"`. */
  readonly valeur: string;
  readonly libelle: string;
}

export interface PresentationContent {
  readonly titre: string;
  readonly paragraphes: readonly string[];
  readonly stats: readonly StatItem[];
}

export interface ContactInfo {
  readonly adresse: string;
  readonly telephone: string;
  readonly email: string;
}

export interface SocialLink {
  readonly reseau: 'facebook' | 'instagram' | 'linkedin';
  readonly label: string;
  readonly url: string;
}

/** A service shown when the API is unreachable or returns nothing. */
export interface ServiceFallback {
  readonly id: string;
  readonly nom: string;
  readonly description: string;
  readonly avantages: readonly string[];
}

/** A weekly opening-hours row shown when the API is unreachable. */
export interface HoraireFallback {
  readonly jour: DayOfWeek;
  readonly libelle: string;
  readonly ferme: boolean;
  /** e.g. `'09:00 – 18:00'`, or `null` when closed. */
  readonly plage: string | null;
}

export interface AccueilContent {
  readonly maxServices: number;
  readonly nbRealisations: number;
}

export interface SiteContent {
  readonly nomEntreprise: string;
  readonly slogan: string;
  readonly nav: readonly NavLink[];
  readonly hero: HeroContent;
  readonly presentation: PresentationContent;
  readonly accueil: AccueilContent;
  readonly contact: ContactInfo;
  readonly socials: readonly SocialLink[];
  /** Absolute or root-relative image used for Open Graph / structured data. */
  readonly ogImage: string;
  readonly servicesFallback: readonly ServiceFallback[];
  readonly horairesFallback: readonly HoraireFallback[];
}
