import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageCarousel } from '../../../shared/ui/image-carousel/image-carousel';
import { formatArabicDate } from '../../../shared/util/format-date';
import type { RealisationView } from '../../../core/data/view-models';

@Component({
  selector: 'app-realisation-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageCarousel],
  template: `
    <article class="group overflow-hidden rounded-card bg-white shadow-card dark:bg-slate-900">
      <div class="aspect-square bg-slate-100 dark:bg-slate-800">
        <app-image-carousel
          [images]="realisation().images"
          [label]="'صور ' + realisation().titre"
          [enlargeable]="true"
        />
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-brand-900 dark:text-brand-100">{{ realisation().titre }}</h3>
          @if (realisation().categorie; as categorie) {
            <span class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {{ categorie }}
            </span>
          }
        </div>
        @if (date(); as d) {
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ d }}</p>
        }
      </div>
    </article>
  `,
})
export class RealisationCard {
  readonly realisation = input.required<RealisationView>();

  protected readonly date = computed(() => formatArabicDate(this.realisation().date));
}
