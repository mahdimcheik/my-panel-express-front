import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionShell } from '../../shared/ui/section-shell/section-shell';

interface Createur {
  readonly nom: string;
  readonly role?: string;
  /** Chemin de l'image sous public/ (à renseigner plus tard). */
  readonly image: string | null;
  /** Initiales affichées tant qu'aucune image n'est fournie. */
  readonly initiales: string;
}

@Component({
  selector: 'app-a-propos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell],
  template: `
    <div class="mx-auto max-w-6xl px-4 pt-24 text-center sm:px-6">
      <h1 class="text-3xl font-bold text-brand-900 md:text-4xl">من نحن</h1>
      <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
        نحن فريق شغوف بتقديم أفضل الخدمات لعملائنا، نجمع بين الخبرة والإبداع لتحقيق نتائج تفوق
        التوقعات.
      </p>
    </div>

    <app-section-shell
      titre="فريق العمل"
      headingId="createurs-title"
      lead="تعرّف على الأشخاص الذين يقفون وراء المشروع."
    >
      <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        @for (createur of createurs; track createur.nom) {
          <li class="flex flex-col items-center rounded-card bg-white p-8 text-center shadow-card">
            <div
              class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-brand-50 ring-4 ring-brand-100"
            >
              @if (createur.image) {
                <img
                  [src]="createur.image"
                  [alt]="createur.nom"
                  width="128"
                  height="128"
                  class="h-full w-full object-cover"
                />
              } @else {
                <span class="text-3xl font-extrabold text-brand-700" dir="ltr" aria-hidden="true">
                  {{ createur.initiales }}
                </span>
              }
            </div>
            <h3 class="mt-5 text-lg font-bold text-brand-900">{{ createur.nom }}</h3>
            @if (createur.role) {
              <p class="mt-1 text-sm text-slate-600">{{ createur.role }}</p>
            }
          </li>
        }
      </ul>
    </app-section-shell>
  `,
})
export class APropos {
  protected readonly createurs: readonly Createur[] = [
    { nom: 'عيسى مشيك', image: null, initiales: 'IM' },
    { nom: 'روميو مشيك', image: null, initiales: 'RM' },
    { nom: 'حسين مشيك', image: null, initiales: 'HM' },
  ];
}
