import { DOCUMENT, Injectable, inject } from '@angular/core';
import { SITE_CONTENT } from '../content/site-content.token';
import type { HoraireFallback } from '../content/site-content.model';

/** Injects and manages page-scoped JSON-LD `<script>` tags in the document head. */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private readonly document = inject(DOCUMENT);
  private readonly content = inject(SITE_CONTENT);

  /** Upserts a JSON-LD block identified by `id`. */
  setJsonLd(id: string, data: unknown): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  remove(id: string): void {
    this.document.getElementById(id)?.remove();
  }

  /** Builds a `LocalBusiness` graph purely from static content (no API dependency). */
  setLocalBusiness(): void {
    const origin = this.document.location?.origin ?? '';
    const { nomEntreprise, contact, socials, ogImage, horairesFallback } = this.content;

    this.setJsonLd('ld-local-business', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: nomEntreprise,
      image: ogImage.startsWith('http') ? ogImage : origin + ogImage,
      url: origin || undefined,
      telephone: contact.telephone,
      email: contact.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: contact.adresse,
      },
      openingHoursSpecification: this.toOpeningHours(horairesFallback),
      sameAs: socials.map((s) => s.url),
    });
  }

  private toOpeningHours(horaires: readonly HoraireFallback[]) {
    return horaires
      .filter((h) => !h.ferme && h.plage)
      .map((h) => {
        const [opens, closes] = h.plage!.split('–').map((p) => p.trim());
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.jour,
          opens,
          closes,
        };
      });
  }
}
