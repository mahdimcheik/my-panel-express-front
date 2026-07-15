import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../../core/content/site-content.token';
import { ParametresStore } from '../../core/data/parametres-store';
import type { SocialReseau } from '../../core/data/view-models';
import { AuthStore } from '../../core/auth/auth-store';
import { Icon, type IconName } from '../../shared/ui/icon/icon';
import { OpeningHours } from '../opening-hours/opening-hours';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, OpeningHours],
  template: `
    <footer class="bg-brand-950 text-slate-200">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="text-lg font-bold text-white">{{ params().nomEntreprise }}</p>
            <p class="mt-3 text-sm text-slate-300">{{ content.slogan }}</p>
            <ul class="mt-4 flex items-center gap-3">
              @for (social of params().socials; track social.reseau) {
                <li>
                  <a
                    [href]="social.url"
                    [attr.aria-label]="social.label"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <app-icon [name]="socialIcon(social.reseau)" [size]="18" />
                  </a>
                </li>
              }
            </ul>
          </div>

          <nav aria-label="روابط التذييل">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-400">روابط سريعة</h2>
            <ul class="mt-4 space-y-2 text-sm">
              @for (link of content.nav; track link.path) {
                <li>
                  <a
                    [routerLink]="link.path"
                    class="text-slate-300 transition-colors hover:text-white"
                  >
                    {{ link.label }}
                  </a>
                </li>
              }
              <li>
                <a
                  [routerLink]="authLink().path"
                  class="text-slate-300 transition-colors hover:text-white"
                >
                  {{ authLink().label }}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-400">
              معلومات الاتصال
            </h2>
            <address class="mt-4 space-y-3 text-sm not-italic text-slate-300">
              <p class="flex items-start gap-2">
                <app-icon name="map-pin" [size]="18" />
                <span>{{ params().adresse }}</span>
              </p>
              @for (tel of params().telephones; track tel) {
                <p class="flex items-center gap-2">
                  <app-icon name="phone" [size]="18" />
                  <a
                    [href]="'tel:' + tel"
                    dir="ltr"
                    class="transition-colors hover:text-white"
                    >{{ tel }}</a
                  >
                </p>
              }
              <p class="flex items-center gap-2">
                <app-icon name="mail" [size]="18" />
                <a
                  [href]="'mailto:' + params().email"
                  class="transition-colors hover:text-white"
                  >{{ params().email }}</a
                >
              </p>
            </address>
          </div>

          <div>
            <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-400">أوقات العمل</h2>
            <div class="mt-4">
              <app-opening-hours />
            </div>
          </div>
        </div>

        <div class="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          © <span dir="ltr">{{ year }}</span> {{ params().nomEntreprise }}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  private readonly auth = inject(AuthStore);
  protected readonly content = inject(SITE_CONTENT);
  protected readonly params = inject(ParametresStore).parametres;
  protected readonly year = new Date().getFullYear();
  protected readonly authLink = computed(() =>
    this.auth.isAuthenticated()
      ? { path: '/admin', label: 'لوحة التحكم' }
      : { path: '/login', label: 'تسجيل الدخول' },
  );

  protected socialIcon(reseau: SocialReseau): IconName {
    return reseau;
  }
}
