import { Injectable, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { HorairesService } from '../../api/endpoints/horaires/horaires.service';
import type { UpdateHoraire } from '../../api/models';
import { sortHorairesAdmin, toHoraireAdminView } from '../admin-mappers';
import type { HoraireAdminView } from '../admin-view-models';

/** Back-office store for opening hours: the seven days plus a whole-grid save. */
@Injectable({ providedIn: 'root' })
export class HorairesAdminStore {
  private readonly api = inject(HorairesService);

  private readonly res = rxResource({
    stream: () => this.api.getHorairesAdmin(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  readonly horaires = computed<readonly HoraireAdminView[]>(() => {
    const data = this.res.hasValue() ? this.res.value().data : null;
    return sortHorairesAdmin((data ?? []).map(toHoraireAdminView));
  });

  reload(): void {
    this.res.reload();
  }

  /** Persists the whole grid in one transaction. */
  saveAll(days: readonly UpdateHoraire[]): Observable<void> {
    return this.api
      .putHoraires([...days])
      .pipe(map(() => undefined), tap(() => this.reload()));
  }
}
