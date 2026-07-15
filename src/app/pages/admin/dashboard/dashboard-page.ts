import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesAdminStore } from '../../../core/data/admin/services-admin-store';
import { RealisationsAdminStore } from '../../../core/data/admin/realisations-admin-store';
import { HorairesAdminStore } from '../../../core/data/admin/horaires-admin-store';
import { AuthStore } from '../../../core/auth/auth-store';
import { Icon, type IconName } from '../../../shared/ui/icon/icon';

interface StatCard {
  readonly label: string;
  readonly value: number;
  readonly hint: string;
  readonly icon: IconName;
  readonly link: string;
}

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <h1 class="text-2xl font-bold text-brand-900">لوحة القيادة</h1>
    @if (user(); as u) {
      <p class="mt-1 text-slate-600">مرحبًا، <span dir="ltr">{{ u.email }}</span></p>
    }

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (card of cards(); track card.link) {
        <a
          [routerLink]="card.link"
          class="flex items-start gap-4 rounded-card border border-slate-200 bg-white p-5 shadow-card transition-colors hover:border-brand-300"
        >
          <span class="rounded-lg bg-brand-50 p-3 text-brand-700">
            <app-icon [name]="card.icon" [size]="24" />
          </span>
          <span class="min-w-0">
            <span class="block text-3xl font-bold text-brand-900">{{ card.value }}</span>
            <span class="block font-medium text-slate-700">{{ card.label }}</span>
            <span class="block text-sm text-slate-500">{{ card.hint }}</span>
          </span>
        </a>
      }
    </div>
  `,
})
export class DashboardPage {
  private readonly servicesStore = inject(ServicesAdminStore);
  private readonly realisationsStore = inject(RealisationsAdminStore);
  private readonly horairesStore = inject(HorairesAdminStore);

  protected readonly user = inject(AuthStore).currentUser;

  protected readonly cards = computed<readonly StatCard[]>(() => {
    const services = this.servicesStore.services();
    const realisations = this.realisationsStore.realisations();
    const horaires = this.horairesStore.horaires();

    const servicesHidden = services.filter((s) => !s.visible).length;
    const realisationsHidden = realisations.filter((r) => !r.visible).length;
    const openDays = horaires.filter((h) => !h.ferme && h.visible).length;

    return [
      {
        label: 'الخدمات',
        value: services.length,
        hint: servicesHidden > 0 ? `${servicesHidden} مخفية` : 'كلها ظاهرة',
        icon: 'briefcase',
        link: '/admin/services',
      },
      {
        label: 'الأعمال',
        value: realisations.length,
        hint: realisationsHidden > 0 ? `${realisationsHidden} مخفي` : 'كلها ظاهرة',
        icon: 'image',
        link: '/admin/realisations',
      },
      {
        label: 'أيام العمل',
        value: openDays,
        hint: 'أيام مفتوحة ظاهرة',
        icon: 'clock',
        link: '/admin/horaires',
      },
    ];
  });
}
