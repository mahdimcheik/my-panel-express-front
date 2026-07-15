import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONTENT } from '../content/site-content.token';

export interface PageSeo {
  readonly description: string;
  /** Root-relative path of the current page, e.g. `'/'` or `'/contact'`. */
  readonly path: string;
  /** Root-relative or absolute image; defaults to the site OG image. */
  readonly image?: string;
}

/** Sets description, canonical link and Open Graph / Twitter meta for the current page. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly content = inject(SITE_CONTENT);
  private readonly document = inject(DOCUMENT);

  setPage(seo: PageSeo): void {
    const origin = this.document.location?.origin ?? '';
    const url = origin + seo.path;
    const image = this.toAbsolute(seo.image ?? this.content.ogImage, origin);
    const currentTitle = this.title.getTitle();

    this.meta.updateTag({ name: 'description', content: seo.description });

    this.meta.updateTag({ property: 'og:title', content: currentTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: 'ar_AR' });
    this.meta.updateTag({ property: 'og:site_name', content: this.content.nomEntreprise });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: currentTitle });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private toAbsolute(image: string, origin: string): string {
    return image.startsWith('http') ? image : origin + image;
  }
}
