import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE_CONTENT } from '../../core/content/site-content.token';
import { SeoService } from '../../core/seo/seo.service';
import { StructuredDataService } from '../../core/seo/structured-data.service';
import { HeroSection } from './sections/hero-section';
import { PresentationSection } from './sections/presentation-section';
import { ServicesHighlight } from './sections/services-highlight';
import { RealisationsRecentes } from './sections/realisations-recentes';
import { ContactCta } from './sections/contact-cta';

@Component({
  selector: 'app-accueil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroSection,
    PresentationSection,
    ServicesHighlight,
    RealisationsRecentes,
    ContactCta,
  ],
  template: `
    <app-hero-section [hero]="content.hero" />
    <app-presentation-section [presentation]="content.presentation" />
    <app-services-highlight [max]="content.accueil.maxServices" />
    <app-realisations-recentes [nombre]="content.accueil.nbRealisations" />
    <app-contact-cta [contact]="content.contact" />
  `,
})
export class Accueil {
  protected readonly content = inject(SITE_CONTENT);
  private readonly seo = inject(SeoService);
  private readonly structuredData = inject(StructuredDataService);

  constructor() {
    this.seo.setPage({
      description:
        'ماي بانل إكسبرس — طباعة وتصنيع اللوحات الإشهارية واللافتات والتشوير بجودة احترافية وخدمة سريعة.',
      path: '/',
    });
    this.structuredData.setLocalBusiness();
  }
}
