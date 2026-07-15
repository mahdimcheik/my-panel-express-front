import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

/** Placeholder grid shown while a card list is loading. */
@Component({
  selector: 'app-card-grid-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Skeleton],
  template: `
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      @for (i of items(); track i) {
        <div class="overflow-hidden rounded-card shadow-card">
          <p-skeleton height="12rem" borderRadius="0" />
          <div class="space-y-3 p-5">
            <p-skeleton width="60%" height="1.5rem" />
            <p-skeleton width="100%" height="1rem" />
            <p-skeleton width="80%" height="1rem" />
          </div>
        </div>
      }
    </div>
  `,
})
export class CardGridSkeleton {
  readonly count = input(6);

  protected readonly items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
