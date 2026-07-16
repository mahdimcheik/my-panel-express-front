import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RealisationsStore } from '../../../core/data/realisations-store';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CardGridSkeleton } from '../../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { RealisationCard } from './realisation-card';

@Component({
  selector: 'app-realisations-recentes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionShell, CardGridSkeleton, RealisationCard],
  template: `
    @if (store.isLoading() || store.items().length) {
      <app-section-shell
        titre="أحدث أعمالنا"
        headingId="realisations-title"
        lead="نماذج من المشاريع التي أنجزناها لعملائنا."
      >
        <div [attr.aria-busy]="store.isLoading()">
          @if (store.isLoading()) {
            <app-card-grid-skeleton [count]="nombre()" />
          } @else {
            <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              @for (realisation of store.items(); track realisation.id) {
                <li><app-realisation-card [realisation]="realisation" /></li>
              }
            </ul>
          }
        </div>

        <div class="mt-10 text-center">
          <a
            routerLink="/realisations"
            class="inline-block rounded-lg border border-brand-600 px-6 py-3 font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/40"
          >
            عرض كل الأعمال
          </a>
        </div>
      </app-section-shell>
    }
  `,
})
export class RealisationsRecentes {
  readonly nombre = input(6);

  protected readonly store = inject(RealisationsStore);

  constructor() {
    effect(() => this.store.setNombre(this.nombre()));
  }
}
