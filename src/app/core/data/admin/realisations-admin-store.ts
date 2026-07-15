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

/** Back-office store for réalisations: the admin list plus every mutation. */
@Injectable({ providedIn: 'root' })
export class RealisationsAdminStore {
  private readonly api = inject(RealisationsService);

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

  getOne(id: string): Observable<RealisationAdminView> {
    return this.api.getRealisationsAdminId(id).pipe(map((r) => unwrap(r)));
  }

  create(value: RealisationFormValue): Observable<RealisationAdminView> {
    return this.api
      .postRealisations(toCreateRealisation(value))
      .pipe(map((r) => unwrap(r)), tap(() => this.reload()));
  }

  update(id: string, value: RealisationFormValue): Observable<RealisationAdminView> {
    return this.api
      .putRealisations(toUpdateRealisation(id, value))
      .pipe(map((r) => unwrap(r)), tap(() => this.reload()));
  }

  remove(id: string): Observable<void> {
    return this.api.deleteRealisationsId(id).pipe(map(() => undefined), tap(() => this.reload()));
  }

  setVisible(id: string, visible: boolean): Observable<RealisationAdminView> {
    return this.api
      .patchRealisationsIdVisibilite(id, { visible })
      .pipe(map((r) => unwrap(r)), tap(() => this.reload()));
  }

  uploadImages(id: string, files: readonly File[]): Observable<RealisationAdminView> {
    return this.api
      .postRealisationsIdImages(id, { files: [...files] })
      .pipe(map((r) => unwrap(r)), tap(() => this.reload()));
  }

  deleteImage(id: string, imageId: string): Observable<RealisationAdminView> {
    return this.api
      .deleteRealisationsIdImagesImageId(id, imageId)
      .pipe(map((r) => unwrap(r)), tap(() => this.reload()));
  }

  reorderImages(id: string, imageIds: readonly string[]): Observable<RealisationAdminView> {
    return this.api
      .putRealisationsIdImagesOrdre(id, toImageOrdre(imageIds))
      .pipe(map((r) => unwrap(r)), tap(() => this.reload()));
  }
}

function unwrap(response: RealisationDetailsResponse): RealisationAdminView {
  const dto: RealisationDetails = response.data ?? {};
  return toRealisationAdminView(dto);
}
