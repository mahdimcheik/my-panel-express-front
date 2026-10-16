import { Injectable, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import { ServicesService } from '../../api/endpoints/services/services.service';
import type { ServiceDetails, ServiceDetailsResponse } from '../../api/models';
import {
  toCreateService,
  toImageOrdre,
  toServiceAdminView,
  toUpdateService,
  type ServiceFormValue,
} from '../admin-mappers';
import type { ServiceAdminView } from '../admin-view-models';
import { ServicesStore } from '../services-store';

/** Back-office store for services: the admin list plus every mutation. */
@Injectable({ providedIn: 'root' })
export class ServicesAdminStore {
  private readonly api = inject(ServicesService);
  private readonly publicStore = inject(ServicesStore);

  private readonly res = rxResource({
    stream: () => this.api.getServicesAdmin(),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  readonly services = computed<readonly ServiceAdminView[]>(() => {
    const data = this.res.hasValue() ? this.res.value().data : null;
    return (data ?? []).map(toServiceAdminView).sort((a, b) => a.ordre - b.ordre);
  });

  reload(): void {
    this.res.reload();
  }

  /** After a mutation: reload the admin list and the public store(s) the site reads from. */
  private refresh(): void {
    this.res.reload();
    this.publicStore.reload();
  }

  getOne(id: string): Observable<ServiceAdminView> {
    return this.api.getServicesAdminId(id).pipe(map((r) => unwrap(r)));
  }

  create(value: ServiceFormValue): Observable<ServiceAdminView> {
    return this.api
      .postServices(toCreateService(value))
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  update(id: string, value: ServiceFormValue): Observable<ServiceAdminView> {
    return this.api
      .putServices(toUpdateService(id, value))
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  remove(id: string): Observable<void> {
    return this.api.deleteServicesId(id).pipe(map(() => undefined), tap(() => this.refresh()));
  }

  setVisible(id: string, visible: boolean): Observable<ServiceAdminView> {
    return this.api
      .patchServicesIdVisibilite(id, { visible })
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  uploadImages(id: string, files: readonly File[]): Observable<ServiceAdminView> {
    return this.api
      .postServicesIdImages(id, { files: [...files] })
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  deleteImage(id: string, imageId: string): Observable<ServiceAdminView> {
    return this.api
      .deleteServicesIdImagesImageId(id, imageId)
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }

  reorderImages(id: string, imageIds: readonly string[]): Observable<ServiceAdminView> {
    return this.api
      .putServicesIdImagesOrdre(id, toImageOrdre(imageIds))
      .pipe(map((r) => unwrap(r)), tap(() => this.refresh()));
  }
}

function unwrap(response: ServiceDetailsResponse): ServiceAdminView {
  const dto: ServiceDetails = response.data ?? {};
  return toServiceAdminView(dto);
}
