import { Injectable, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ParametresService } from '../api/endpoints/parametres/parametres.service';
import { SITE_CONTENT } from '../content/site-content.token';
import { toParametresView } from './mappers';
import type { ParametresView } from './view-models';

/**
 * Loads the public site parameters (company name, address, phones, socials) from
 * `/parametres`, resolving each field against the static {@link SITE_CONTENT} fallback.
 * `parametres()` is always populated — it returns the static copy while loading or on error.
 */
@Injectable({ providedIn: 'root' })
export class ParametresStore {
  private readonly api = inject(ParametresService);
  private readonly content = inject(SITE_CONTENT);

  private readonly res = rxResource({
    stream: () => this.api.getParametres(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  readonly parametres = computed<ParametresView>(() => {
    // `value()` throws while the resource is in an error state — guard with `hasValue()`.
    const data = this.res.hasValue() ? this.res.value().data : null;
    return toParametresView(data ?? null, this.content);
  });

  reload(): void {
    this.res.reload();
  }
}
