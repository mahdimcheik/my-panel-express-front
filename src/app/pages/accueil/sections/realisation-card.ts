import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RemoteImage } from '../../../shared/ui/remote-image/remote-image';
import { formatArabicDate } from '../../../shared/util/format-date';
import type { RealisationView } from '../../../core/data/view-models';

@Component({
  selector: 'app-realisation-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RemoteImage],
  template: `
    <article class="group overflow-hidden rounded-card bg-white shadow-card">
      <div class="aspect-square bg-slate-100">
        @if (realisation().image; as image) {
          <app-remote-image [image]="image" />
        }
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-bold text-brand-900">{{ realisation().titre }}</h3>
          @if (realisation().categorie; as categorie) {
            <span class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              {{ categorie }}
            </span>
          }
        </div>
        @if (date(); as d) {
          <p class="mt-1 text-xs text-slate-500">{{ d }}</p>
        }
      </div>
    </article>
  `,
})
export class RealisationCard {
  readonly realisation = input.required<RealisationView>();

  protected readonly date = computed(() => formatArabicDate(this.realisation().date));
}
