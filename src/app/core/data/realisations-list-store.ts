import { Injectable, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RealisationsService } from '../api/endpoints/realisations/realisations.service';
import { toRealisationView } from './mappers';
import type { RealisationView } from './view-models';

/**
 * Loads the full public réalisations list (all visible items) for the portfolio page.
 * Separate from {@link RealisationsStore}, which only fetches the recent few for the home page.
 */
@Injectable({ providedIn: 'root' })
export class RealisationsListStore {
  private readonly api = inject(RealisationsService);

  private readonly res = rxResource({
    stream: () => this.api.getRealisations(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  readonly items = computed<readonly RealisationView[]>(() => {
    // `value()` throws while the resource is in an error state — guard with `hasValue()`.
    const data = this.res.hasValue() ? this.res.value().data : null;
    return (data ?? []).map(toRealisationView);
  });

  /** Distinct categories present in the list, in first-seen order. */
  readonly categories = computed<readonly string[]>(() => {
    const seen = new Set<string>();
    for (const item of this.items()) {
      if (item.categorie) {
        seen.add(item.categorie);
      }
    }
    return [...seen];
  });

  reload(): void {
    this.res.reload();
  }
}
