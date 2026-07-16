import type {
  HoraireDetails,
  ParametresDetails,
  RealisationDetails,
  RealisationImageDetails,
  ServiceDetails,
  ServiceImageDetails,
  UserDetails,
} from '../api/models';
import type {
  ServiceFallback,
  HoraireFallback,
  SiteContent,
} from '../content/site-content.model';
import { splitLines } from '../../shared/util/lines';
import type {
  HoraireView,
  ImageRef,
  ParametresView,
  RealisationView,
  ServiceView,
  SocialLinkView,
  SocialReseau,
  UserView,
} from './view-models';

type ImageDetails = ServiceImageDetails | RealisationImageDetails;

/** All images that carry a usable presigned URL, lowest `ordre` first. */
function allImages(
  images: readonly ImageDetails[] | null | undefined,
  alt: string,
): ImageRef[] {
  return [...(images ?? [])]
    .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))
    .filter((i): i is ImageDetails & { url: string } => typeof i.url === 'string' && i.url.length > 0)
    .map((i) => ({ url: i.url, objectKey: i.objectKey ?? null, alt }));
}

/** Trims a .NET `"09:00:00"` time to `"09:00"`. */
export function toHm(time: string | null | undefined): string | null {
  if (!time) {
    return null;
  }
  const [h, m] = time.split(':');
  return h && m ? `${h}:${m}` : time;
}

export const DAY_LABELS: Record<string, string> = {
  Sunday: 'الأحد',
  Monday: 'الاثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة',
  Saturday: 'السبت',
};

/** Monday → Sunday, the display order used across the site. */
export const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function toServiceView(dto: ServiceDetails): ServiceView {
  const nom = dto.nom?.trim() ?? '';
  const images = allImages(dto.images, nom ? `صورة لخدمة ${nom}` : '');
  return {
    id: dto.id ?? '',
    nom: nom || 'خدمة',
    description: dto.description?.trim() ?? '',
    avantages: splitLines(dto.avantages),
    image: images[0] ?? null,
    images,
    ordre: dto.ordre ?? 0,
  };
}

export function toRealisationView(dto: RealisationDetails): RealisationView {
  const titre = dto.titre?.trim() ?? '';
  const categorie = dto.categorie?.trim() || null;
  const alt = titre ? (categorie ? `${titre} – ${categorie}` : titre) : '';
  const images = allImages(dto.images, alt);
  return {
    id: dto.id ?? '',
    titre: titre || 'مشروع',
    description: dto.description?.trim() ?? '',
    categorie,
    date: dto.dateRealisation ?? null,
    image: images[0] ?? null,
    images,
  };
}

export function toHoraireView(dto: HoraireDetails): HoraireView {
  const jour = dto.jourSemaine ?? 'Monday';
  const ferme = dto.ferme ?? false;
  const opens = toHm(dto.heureOuverture);
  const closes = toHm(dto.heureFermeture);
  return {
    jour,
    libelle: DAY_LABELS[jour] ?? jour,
    ferme,
    plage: !ferme && opens && closes ? `${opens} – ${closes}` : null,
  };
}

export function toUserView(dto: UserDetails): UserView {
  const email = dto.email?.trim() ?? '';
  const nomComplet = [dto.firstName, dto.lastName]
    .map((part) => part?.trim() ?? '')
    .filter((part) => part.length > 0)
    .join(' ');
  return {
    id: dto.id ?? '',
    email,
    nomComplet: nomComplet || email,
  };
}

export function sortHoraires(views: readonly HoraireView[]): HoraireView[] {
  return [...views].sort((a, b) => DAY_ORDER.indexOf(a.jour) - DAY_ORDER.indexOf(b.jour));
}

// --- Fallback (static content) → view mappers ---

export function serviceFallbackToView(f: ServiceFallback): ServiceView {
  return {
    id: f.id,
    nom: f.nom,
    description: f.description,
    avantages: f.avantages,
    image: null,
    images: [],
    ordre: 0,
  };
}

export function horaireFallbackToView(f: HoraireFallback): HoraireView {
  return { jour: f.jour, libelle: f.libelle, ferme: f.ferme, plage: f.plage };
}

// --- Paramètres (site settings) ---

const SOCIAL_LABELS: Record<SocialReseau, string> = {
  facebook: 'فيسبوك',
  instagram: 'إنستغرام',
  whatsapp: 'واتساب',
  tiktok: 'تيك توك',
  linkedin: 'لينكدإن',
};

/** Builds the social-link list from the four nullable URL fields, dropping the empty ones. */
function toSocialViews(dto: ParametresDetails | null | undefined): SocialLinkView[] {
  const out: SocialLinkView[] = [];
  const add = (reseau: SocialReseau, url: string | null | undefined) => {
    const trimmed = (url ?? '').trim();
    if (trimmed) {
      out.push({ reseau, label: SOCIAL_LABELS[reseau], url: trimmed });
    }
  };
  add('facebook', dto?.facebook);
  add('instagram', dto?.instagram);
  add('whatsapp', dto?.whatsApp);
  add('tiktok', dto?.tikTok);
  return out;
}

/**
 * Resolves the public site parameters: each live `/parametres` field overrides the
 * matching static {@link SiteContent} value; missing ones fall back to the static copy.
 */
export function toParametresView(
  dto: ParametresDetails | null | undefined,
  fallback: SiteContent,
): ParametresView {
  const telephones = (dto?.telephones ?? [])
    .map((t) => (t ?? '').trim())
    .filter((t) => t.length > 0);
  const hasPhones = telephones.length > 0;
  const socials = toSocialViews(dto);

  return {
    nomEntreprise: dto?.nomEntreprise?.trim() || fallback.nomEntreprise,
    adresse: dto?.adresse?.trim() || fallback.contact.adresse,
    telephones: hasPhones ? telephones : [fallback.contact.telephone],
    telephone: hasPhones ? telephones[0] : fallback.contact.telephone,
    email: dto?.email?.trim() || fallback.contact.email,
    socials:
      socials.length > 0
        ? socials
        : fallback.socials.map((s) => ({ reseau: s.reseau, label: s.label, url: s.url })),
  };
}
