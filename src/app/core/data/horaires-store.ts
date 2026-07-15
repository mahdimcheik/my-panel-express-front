import { Injectable, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HorairesService } from '../api/endpoints/horaires/horaires.service';
import { SITE_CONTENT } from '../content/site-content.token';
import { horaireFallbackToView, sortHoraires, toHoraireView } from './mappers';
import type { HoraireView } from './view-models';

/** Loads public opening hours (footer), with a static fallback. */
@Injectable({ providedIn: 'root' })
export class HorairesStore {
  private readonly api = inject(HorairesService);
  private readonly content = inject(SITE_CONTENT);

  private readonly res = rxResource({
    stream: () => this.api.getHoraires(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  private readonly fromApi = computed<readonly HoraireView[]>(() => {
    // `value()` throws while the resource is in an error state — guard with `hasValue()`.
    const data = this.res.hasValue() ? this.res.value().data : null;
    return sortHoraires((data ?? []).map(toHoraireView));
  });

  readonly horaires = computed<readonly HoraireView[]>(() => {
    if (this.isLoading()) {
      return [];
    }
    const live = this.fromApi();
    if (live.length > 0) {
      return live;
    }
    return this.content.horairesFallback.map(horaireFallbackToView);
  });

  reload(): void {
    this.res.reload();
  }
}
