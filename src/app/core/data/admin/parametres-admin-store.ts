import { Injectable, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { ParametresService } from '../../api/endpoints/parametres/parametres.service';
import type { UpdateParametres } from '../../api/models';
import { toParametresAdminView } from '../admin-mappers';
import type { ParametresAdminView } from '../admin-view-models';

/** Back-office store for the site parameters: the single settings row plus a save. */
@Injectable({ providedIn: 'root' })
export class ParametresAdminStore {
  private readonly api = inject(ParametresService);

  private readonly res = rxResource({
    stream: () => this.api.getParametres(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  readonly parametres = computed<ParametresAdminView | null>(() => {
    const data = this.res.hasValue() ? this.res.value().data : null;
    return data ? toParametresAdminView(data) : null;
  });

  reload(): void {
    this.res.reload();
  }

  /** Persists the whole settings row. */
  save(payload: UpdateParametres): Observable<void> {
    return this.api.putParametres(payload).pipe(
      map(() => undefined),
      tap(() => this.reload()),
    );
  }
}
