import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RealisationsListStore } from '../../core/data/realisations-list-store';
import { CardGridSkeleton } from '../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { LoadError } from '../../shared/ui/load-error/load-error';
import { RealisationCard } from '../accueil/sections/realisation-card';

@Component({
  selector: 'app-realisations-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardGridSkeleton, LoadError, RealisationCard],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header class="mb-8 max-w-2xl">
        <h1 class="text-3xl font-bold text-brand-900 md:text-4xl">أعمالنا</h1>
        <p class="mt-3 text-base text-slate-600 md:text-lg">
          نماذج من المشاريع التي أنجزناها لعملائنا.
        </p>
      </header>

      @if (store.categories().length) {
        <div class="mb-8 flex flex-wrap gap-2" role="group" aria-label="تصفية حسب التصنيف">
          <button
            type="button"
            [attr.aria-pressed]="selected() === null"
            class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
            [class]="
              selected() === null
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            "
            (click)="selected.set(null)"
          >
            الكل
          </button>
          @for (cat of store.categories(); track cat) {
            <button
              type="button"
              [attr.aria-pressed]="selected() === cat"
              class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
              [class]="
                selected() === cat
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              "
              (click)="selected.set(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      }

      <div [attr.aria-busy]="store.isLoading()">
        @if (store.isLoading()) {
          <app-card-grid-skeleton [count]="6" />
        } @else if (store.failed()) {
          <app-load-error (retry)="store.reload()" />
        } @else if (filtered().length) {
          <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (realisation of filtered(); track realisation.id) {
              <li><app-realisation-card [realisation]="realisation" /></li>
            }
          </ul>
        } @else {
          <p class="text-slate-600">لا توجد أعمال متاحة حاليًا.</p>
        }
      </div>
    </div>
  `,
})
export class RealisationsPage {
  protected readonly store = inject(RealisationsListStore);

  /** Selected category, or `null` for "all". */
  protected readonly selected = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const cat = this.selected();
    const items = this.store.items();
    return cat === null ? items : items.filter((r) => r.categorie === cat);
  });
}
