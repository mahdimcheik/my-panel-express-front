import { InjectionToken, type Provider } from '@angular/core';
import type { SiteContent } from './site-content.model';
import { SITE_CONTENT as DEFAULT_SITE_CONTENT } from './site-content';

/**
 * Injectable handle on the site's static content. Injecting the token (rather than
 * importing the constant directly) is the single swap-point for a future /parametres API.
 */
export const SITE_CONTENT = new InjectionToken<SiteContent>('SITE_CONTENT', {
  providedIn: 'root',
  factory: () => DEFAULT_SITE_CONTENT,
});

export function provideSiteContent(content: SiteContent): Provider {
  return { provide: SITE_CONTENT, useValue: content };
}
