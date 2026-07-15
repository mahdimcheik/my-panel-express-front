import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesStore } from '../../../core/data/services-store';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import { CardGridSkeleton } from '../../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { LoadError } from '../../../shared/ui/load-error/load-error';
import { ServiceCard } from './service-card';

@Component({
  selector: 'app-services-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionShell, CardGridSkeleton, LoadError, ServiceCard],
  template: `
    <div class="bg-slate-50">
      <app-section-shell
        titre="خدماتنا"
        headingId="services-title"
        lead="حلول متكاملة للطباعة والتصنيع تناسب كل احتياجاتك."
      >
        <div [attr.aria-busy]="store.isLoading()">
          @if (store.isLoading()) {
            <app-card-grid-skeleton [count]="max()" />
          } @else {
            <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              @for (service of visible(); track service.id) {
                <li><app-service-card [service]="service" /></li>
              }
            </ul>
            @if (store.failed()) {
              <app-load-error (retry)="store.reload()" />
            }
          }
        </div>

        <div class="mt-10 text-center">
          <a
            routerLink="/services"
            class="inline-block rounded-lg border border-brand-600 px-6 py-3 font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            عرض كل الخدمات
          </a>
        </div>
      </app-section-shell>
    </div>
  `,
})
export class ServicesHighlight {
  readonly max = input(6);

  protected readonly store = inject(ServicesStore);
  protected readonly visible = computed(() => this.store.services().slice(0, this.max()));
}
