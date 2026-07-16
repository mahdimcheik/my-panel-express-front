import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageCarousel } from '../../../shared/ui/image-carousel/image-carousel';
import { Icon } from '../../../shared/ui/icon/icon';
import type { ServiceView } from '../../../core/data/view-models';

@Component({
  selector: 'app-service-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ImageCarousel, Icon],
  template: `
    <article class="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card dark:bg-slate-900">
      <div class="aspect-[4/3] bg-slate-100 dark:bg-slate-800">
        <app-image-carousel [images]="service().images" [label]="'صور ' + service().nom" />
      </div>
      <div class="flex flex-1 flex-col p-5">
        <h3 class="text-lg font-bold text-brand-900 dark:text-brand-100">{{ service().nom }}</h3>
        @if (service().description) {
          <p class="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{{ service().description }}</p>
        }
        @if (avantages().length) {
          <ul class="mt-4 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            @for (avantage of avantages(); track avantage) {
              <li class="flex items-center gap-2">
                <span class="text-brand-600"><app-icon name="check" [size]="16" /></span>
                <span>{{ avantage }}</span>
              </li>
            }
          </ul>
        }
        <a
          routerLink="/services"
          class="mt-5 inline-flex items-center gap-1 self-start font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          اعرف المزيد
          <span class="-scale-x-100"><app-icon name="arrow-left" [size]="18" /></span>
        </a>
      </div>
    </article>
  `,
})
export class ServiceCard {
  readonly service = input.required<ServiceView>();

  protected readonly avantages = computed(() => this.service().avantages.slice(0, 3));
}
