import type {
  CreateRealisation,
  CreateService,
  HoraireDetails,
  ImageOrdre,
  ParametresDetails,
  RealisationDetails,
  RealisationImageDetails,
  ServiceDetails,
  ServiceImageDetails,
  UpdateHoraire,
  UpdateParametres,
  UpdateRealisation,
  UpdateService,
} from '../api/models';
import { splitLines } from '../../shared/util/lines';
import { DAY_LABELS, DAY_ORDER, toHm } from './mappers';
import type {
  AdminImage,
  HoraireAdminView,
  ParametresAdminView,
  RealisationAdminView,
  ServiceAdminView,
} from './admin-view-models';

type ImageDetails = ServiceImageDetails | RealisationImageDetails;

function toAdminImage(dto: ImageDetails, alt: string): AdminImage {
  const url = typeof dto.url === 'string' ? dto.url : '';
  return {
    id: dto.id ?? '',
    objectKey: dto.objectKey ?? null,
    ordre: dto.ordre ?? 0,
    ref: { url, objectKey: dto.objectKey ?? null, alt },
  };
}

function toAdminImages(
  images: readonly ImageDetails[] | null | undefined,
  alt: string,
): readonly AdminImage[] {
  return [...(images ?? [])]
    .map((img) => toAdminImage(img, alt))
    .sort((a, b) => a.ordre - b.ordre);
}

export function toServiceAdminView(dto: ServiceDetails): ServiceAdminView {
  const nom = dto.nom?.trim() ?? '';
  return {
    id: dto.id ?? '',
    nom: nom || 'خدمة',
    description: dto.description?.trim() ?? '',
    avantages: splitLines(dto.avantages),
    ordre: dto.ordre ?? 0,
    visible: dto.visible ?? false,
    images: toAdminImages(dto.images, nom ? `صورة لخدمة ${nom}` : ''),
    updatedAt: dto.updatedAt ?? null,
  };
}

export function toRealisationAdminView(dto: RealisationDetails): RealisationAdminView {
  const titre = dto.titre?.trim() ?? '';
  const categorie = dto.categorie?.trim() ?? '';
  const alt = titre ? (categorie ? `${titre} – ${categorie}` : titre) : '';
  return {
    id: dto.id ?? '',
    titre: titre || 'مشروع',
    description: dto.description?.trim() ?? '',
    categorie,
    dateRealisation: dto.dateRealisation ?? null,
    visible: dto.visible ?? false,
    images: toAdminImages(dto.images, alt),
    updatedAt: dto.updatedAt ?? null,
  };
}

export function toHoraireAdminView(dto: HoraireDetails): HoraireAdminView {
  const jour = dto.jourSemaine ?? 'Monday';
  return {
    id: dto.id ?? '',
    jour,
    libelle: DAY_LABELS[jour] ?? jour,
    ferme: dto.ferme ?? false,
    heureOuverture: toHm(dto.heureOuverture),
    heureFermeture: toHm(dto.heureFermeture),
    visible: dto.visible ?? true,
  };
}

export function sortHorairesAdmin(views: readonly HoraireAdminView[]): HoraireAdminView[] {
  return [...views].sort((a, b) => DAY_ORDER.indexOf(a.jour) - DAY_ORDER.indexOf(b.jour));
}

export function toParametresAdminView(dto: ParametresDetails): ParametresAdminView {
  const telephones = (dto.telephones ?? [])
    .map((t) => (t ?? '').trim())
    .filter((t) => t.length > 0);
  return {
    nomEntreprise: dto.nomEntreprise?.trim() ?? '',
    adresse: dto.adresse?.trim() ?? '',
    telephones,
    email: dto.email?.trim() ?? '',
    logo: dto.logo?.trim() || null,
    facebook: dto.facebook?.trim() ?? '',
    instagram: dto.instagram?.trim() ?? '',
    whatsApp: dto.whatsApp?.trim() ?? '',
    tikTok: dto.tikTok?.trim() ?? '',
    updatedAt: dto.updatedAt ?? null,
  };
}

// --- Form values → write DTOs ---

/** Joins textarea lines back into the newline-delimited string the API expects. */
export function joinLines(lines: readonly string[]): string {
  return lines.map((line) => line.trim()).filter((line) => line.length > 0).join('\n');
}

export interface ServiceFormValue {
  readonly nom: string;
  readonly description: string;
  readonly avantages: string;
  readonly ordre: number;
  readonly visible: boolean;
}

export function toCreateService(value: ServiceFormValue): CreateService {
  return {
    nom: value.nom.trim(),
    description: value.description.trim(),
    avantages: joinLines(splitLines(value.avantages)) || null,
    ordre: value.ordre,
    visible: value.visible,
  };
}

export function toUpdateService(id: string, value: ServiceFormValue): UpdateService {
  return { id, ...toCreateService(value) };
}

export interface RealisationFormValue {
  readonly titre: string;
  readonly description: string;
  readonly categorie: string;
  /** ISO date (`YYYY-MM-DD`). */
  readonly dateRealisation: string;
  readonly visible: boolean;
}

export function toCreateRealisation(value: RealisationFormValue): CreateRealisation {
  return {
    titre: value.titre.trim(),
    description: value.description.trim(),
    categorie: value.categorie.trim(),
    dateRealisation: value.dateRealisation,
    visible: value.visible,
  };
}

export function toUpdateRealisation(id: string, value: RealisationFormValue): UpdateRealisation {
  return { id, ...toCreateRealisation(value) };
}

/** Pads a `HH:mm` value to the `HH:mm:ss` the .NET `TimeOnly` binder expects. */
function toHms(time: string | null): string | null {
  if (!time) {
    return null;
  }
  return time.length === 5 ? `${time}:00` : time;
}

export function toUpdateHoraire(view: {
  id: string;
  ferme: boolean;
  visible: boolean;
  heureOuverture: string | null;
  heureFermeture: string | null;
}): UpdateHoraire {
  return {
    id: view.id,
    ferme: view.ferme,
    visible: view.visible,
    heureOuverture: view.ferme ? null : toHms(view.heureOuverture),
    heureFermeture: view.ferme ? null : toHms(view.heureFermeture),
  };
}

/** Builds the full `ImageOrdre[]` payload from a reordered list of image ids. */
export function toImageOrdre(ids: readonly string[]): ImageOrdre[] {
  return ids.map((imageId, index) => ({ imageId, ordre: index }));
}

export interface ParametresFormValue {
  readonly nomEntreprise: string;
  readonly adresse: string;
  /** One phone number per line. */
  readonly telephones: string;
  readonly facebook: string;
  readonly instagram: string;
  readonly whatsApp: string;
  readonly tikTok: string;
}

/** Trims a text field, mapping the empty string to `null` for the nullable API fields. */
function trimOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function toUpdateParametres(value: ParametresFormValue): UpdateParametres {
  const telephones = splitLines(value.telephones)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  return {
    nomEntreprise: value.nomEntreprise.trim(),
    adresse: value.adresse.trim(),
    telephones: telephones.length > 0 ? telephones : null,
    facebook: trimOrNull(value.facebook),
    instagram: trimOrNull(value.instagram),
    whatsApp: trimOrNull(value.whatsApp),
    tikTok: trimOrNull(value.tikTok),
  };
}
