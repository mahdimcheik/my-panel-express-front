import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RealisationsService } from '../api/endpoints/realisations/realisations.service';
import { toRealisationView } from './mappers';
import type { RealisationView } from './view-models';

/**
 * Loads the recent realisations for the home page. Unlike services, there is no
 * fallback: on empty/error the list is empty and the section hides itself.
 */
@Injectable({ providedIn: 'root' })
export class RealisationsStore {
  private readonly api = inject(RealisationsService);

  private readonly nombre = signal(6);

  private readonly res = rxResource({
    params: () => ({ nombre: this.nombre() }),
    stream: ({ params }) => this.api.getRealisationsRecentes({ nombre: params.nombre }),
  });

  readonly isLoading = this.res.isLoading;
  readonly failed = computed(() => this.res.error() !== undefined);

  readonly items = computed<readonly RealisationView[]>(() => {
    // `value()` throws while the resource is in an error state — guard with `hasValue()`.
    const data = this.res.hasValue() ? this.res.value().data : null;
    return (data ?? []).map(toRealisationView);
  });

  setNombre(nombre: number): void {
    this.nombre.set(nombre);
  }

  reload(): void {
    this.res.reload();
  }
}
