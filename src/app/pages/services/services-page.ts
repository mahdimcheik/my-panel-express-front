import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ServicesStore } from '../../core/data/services-store';
import { CardGridSkeleton } from '../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { LoadError } from '../../shared/ui/load-error/load-error';
import { ServiceCard } from '../accueil/sections/service-card';

@Component({
  selector: 'app-services-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardGridSkeleton, LoadError, ServiceCard],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header class="mb-10 max-w-2xl">
        <h1 class="text-3xl font-bold text-brand-900 md:text-4xl">خدماتنا</h1>
        <p class="mt-3 text-base text-slate-600 md:text-lg">
          حلول متكاملة للطباعة والتصنيع تناسب كل احتياجاتك.
        </p>
      </header>

      <div [attr.aria-busy]="store.isLoading()">
        @if (store.isLoading()) {
          <app-card-grid-skeleton [count]="6" />
        } @else {
          @if (store.services().length) {
            <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              @for (service of store.services(); track service.id) {
                <li><app-service-card [service]="service" /></li>
              }
            </ul>
          } @else {
            <p class="text-slate-600">لا توجد خدمات متاحة حاليًا.</p>
          }
          @if (store.failed()) {
            <app-load-error (retry)="store.reload()" />
          }
        }
      </div>
    </div>
  `,
})
export class ServicesPage {
  protected readonly store = inject(ServicesStore);
}
