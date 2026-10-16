import { Injectable, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { RealisationsService } from '../../api/endpoints/realisations/realisations.service';
import type { RealisationDetails, RealisationDetailsResponse } from '../../api/models';
import {
  toCreateRealisation,
  toImageOrdre,
  toRealisationAdminView,
  toUpdateRealisation,
  type RealisationFormValue,
} from '../admin-mappers';
import type { RealisationAdminView } from '../admin-view-models';
import { RealisationsListStore } from '../realisations-list-store';
import { RealisationsStore } from '../realisations-store';

/** Back-office store for réalisations: the admin list plus every mutation. */
@Injectable({ providedIn: 'root' })
export class RealisationsAdminStore {
  private readonly api = inject(RealisationsService);
  private readonly recentStore = inject(RealisationsStore);
  private readonly listStore = inject(RealisationsListStore);

  private readonly res = rxResource({
    stream: () => this.api.getRealisationsAdmin(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  readonly realisations = computed<readonly RealisationAdminView[]>(() => {
    const data = this.res.hasValue() ? this.res.value().data : null;
    return (data ?? [])
      .map(toRealisationAdminView)
      .sort((a, b) => (b.dateRealisation ?? '').localeCompare(a.dateRealisation ?? ''));
  });

  reload(): void {
    this.res.reload();
  }

  /** After a mutation: reload the admin list and the public store(s) the site reads from. */
  private refresh(): void {
    this.res.reload();
    this.recentStore.reload();
    this.listStore.reload();
  }

  getOne(id: string): Observable<RealisationAdminView> {
    return this.api.getRealisationsAdminId(id).pipe(map((r) => unwrap(r)));
  }

  create(value: RealisationFormValue): Observable<RealisationAdminView> {
    return this.api
      .postRealisations(toCreateRealisation(value))
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  update(id: string, value: RealisationFormValue): Observable<RealisationAdminView> {
    return this.api
      .putRealisations(toUpdateRealisation(id, value))
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  remove(id: string): Observable<void> {
    return this.api.deleteRealisationsId(id).pipe(map(() => undefined), tap(() => this.refresh()));
  }

  setVisible(id: string, visible: boolean): Observable<RealisationAdminView> {
    return this.api
      .patchRealisationsIdVisibilite(id, { visible })
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  uploadImages(id: string, files: readonly File[]): Observable<RealisationAdminView> {
    return this.api
      .postRealisationsIdImages(id, { files: [...files] })
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  deleteImage(id: string, imageId: string): Observable<RealisationAdminView> {
    return this.api
      .deleteRealisationsIdImagesImageId(id, imageId)
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  reorderImages(id: string, imageIds: readonly string[]): Observable<RealisationAdminView> {
    return this.api
      .putRealisationsIdImagesOrdre(id, toImageOrdre(imageIds))
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }
}

function unwrap(response: RealisationDetailsResponse): RealisationAdminView {
  const dto: RealisationDetails = response.data ?? {};
  return toRealisationAdminView(dto);
}
