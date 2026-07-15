import { Injectable, computed, inject, isDevMode } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ServicesService } from '../api/endpoints/services/services.service';
import { SITE_CONTENT } from '../content/site-content.token';
import { serviceFallbackToView, toServiceView } from './mappers';
import type { ServiceView } from './view-models';

/** Loads the public services list, unwraps the envelope, and falls back to static content. */
@Injectable({ providedIn: 'root' })
export class ServicesStore {
  private readonly api = inject(ServicesService);
  private readonly content = inject(SITE_CONTENT);

  private readonly res = rxResource({
    stream: () => this.api.getServices(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  private readonly fromApi = computed<readonly ServiceView[]>(() => {
    // `value()` throws while the resource is in an error state — guard with `hasValue()`.
    const data = this.res.hasValue() ? this.res.value().data : null;
    return (data ?? []).map(toServiceView).sort((a, b) => a.ordre - b.ordre);
  });

  /** API services, or the static fallback when the API is empty/unreachable. */
  readonly services = computed<readonly ServiceView[]>(() => {
    if (this.isLoading()) {
      return [];
    }
    const live = this.fromApi();
    if (live.length > 0) {
      return live;
    }
    if (isDevMode()) {
      console.warn('[ServicesStore] using static fallback (API empty or unreachable).');
    }
    return this.content.servicesFallback.map(serviceFallbackToView);
  });

  readonly usingFallback = computed(() => !this.isLoading() && this.fromApi().length === 0);

  reload(): void {
    this.res.reload();
  }
}
