import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SITE_CONTENT } from '../content/site-content.token';

/** Appends the company name to every route title: `«titre» | «nomEntreprise»`. */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly content = inject(SITE_CONTENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(snapshot);
    this.title.setTitle(
      routeTitle ? `${routeTitle} | ${this.content.nomEntreprise}` : this.content.nomEntreprise,
    );
  }
}
