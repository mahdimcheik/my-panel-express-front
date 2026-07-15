import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ParametresStore } from '../../core/data/parametres-store';
import { HorairesStore } from '../../core/data/horaires-store';
import { Icon } from '../../shared/ui/icon/icon';
import { ContactForm } from './contact-form';

@Component({
  selector: 'app-contact-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, ContactForm],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header class="mb-10 max-w-2xl">
        <h1 class="text-3xl font-bold text-brand-900 md:text-4xl">اتصل بنا</h1>
        <p class="mt-3 text-base text-slate-600 md:text-lg">
          أخبرنا عن مشروعك، وسنعاود التواصل معك في أقرب وقت.
        </p>
      </header>

      <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <aside class="space-y-8">
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <span class="mt-0.5 text-brand-600"><app-icon name="map-pin" [size]="20" /></span>
              <span class="text-slate-700">{{ params().adresse }}</span>
            </li>
            @for (tel of params().telephones; track tel) {
              <li class="flex items-center gap-3">
                <span class="text-brand-600"><app-icon name="phone" [size]="20" /></span>
                <a [href]="'tel:' + tel" class="text-slate-700 hover:text-brand-700" dir="ltr">
                  {{ tel }}
                </a>
              </li>
            }
            <li class="flex items-center gap-3">
              <span class="text-brand-600"><app-icon name="mail" [size]="20" /></span>
              <a [href]="'mailto:' + params().email" class="text-slate-700 hover:text-brand-700" dir="ltr">
                {{ params().email }}
              </a>
            </li>
          </ul>

          @if (horaires.horaires().length) {
            <div>
              <h2 class="mb-3 flex items-center gap-2 font-bold text-brand-900">
                <app-icon name="clock" [size]="18" />
                أوقات العمل
              </h2>
              <dl class="space-y-2 text-sm">
                @for (h of horaires.horaires(); track h.jour) {
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-slate-600">{{ h.libelle }}</dt>
                    <dd
                      [dir]="h.ferme ? 'rtl' : 'ltr'"
                      [class]="h.ferme ? 'text-slate-400' : 'text-slate-800'"
                    >
                      {{ h.ferme ? 'مغلق' : h.plage }}
                    </dd>
                  </div>
                }
              </dl>
            </div>
          }
        </aside>

        <div class="rounded-card border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <app-contact-form />
        </div>
      </div>
    </div>
  `,
})
export class ContactPage {
  protected readonly params = inject(ParametresStore).parametres;
  protected readonly horaires = inject(HorairesStore);
}
