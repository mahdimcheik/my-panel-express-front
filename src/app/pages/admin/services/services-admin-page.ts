import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServicesAdminStore } from '../../../core/data/admin/services-admin-store';
import { Icon } from '../../../shared/ui/icon/icon';
import { CardGridSkeleton } from '../../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { LoadError } from '../../../shared/ui/load-error/load-error';
import type { ServiceAdminView } from '../../../core/data/admin-view-models';

@Component({
  selector: 'app-services-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TableModule, Tag, ButtonModule, Icon, CardGridSkeleton, LoadError],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-brand-900">الخدمات</h1>
      <a
        routerLink="/admin/services/new"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <app-icon name="plus" [size]="18" />
        خدمة جديدة
      </a>
    </div>

    <div class="mt-6">
      @if (store.isLoading()) {
        <app-card-grid-skeleton [count]="4" />
      } @else if (store.failed()) {
        <app-load-error (retry)="store.reload()" />
      } @else {
        <p-table
          [value]="rows()"
          [rows]="10"
          [paginator]="rows().length > 10"
          [rowHover]="true"
          styleClass="p-datatable-sm"
          responsiveLayout="stack"
        >
          <ng-template #header>
            <tr>
              <th scope="col">الاسم</th>
              <th scope="col" class="w-20">الترتيب</th>
              <th scope="col" class="w-24">الصور</th>
              <th scope="col" class="w-28">الحالة</th>
              <th scope="col" class="w-40">إجراءات</th>
            </tr>
          </ng-template>
          <ng-template #body let-svc>
            <tr>
              <td class="font-medium text-brand-900">{{ svc.nom }}</td>
              <td>{{ svc.ordre }}</td>
              <td>{{ svc.images.length }}</td>
              <td>
                @if (svc.visible) {
                  <p-tag severity="success" value="ظاهرة" />
                } @else {
                  <p-tag severity="secondary" value="مخفية" />
                }
              </td>
              <td>
                <div class="flex items-center gap-1">
                  <a
                    [routerLink]="['/admin/services', svc.id]"
                    class="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                    [attr.aria-label]="'تعديل ' + svc.nom"
                  >
                    <app-icon name="edit" [size]="18" />
                  </a>
                  <button
                    type="button"
                    [disabled]="busyId() === svc.id"
                    class="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    [attr.aria-pressed]="svc.visible"
                    [attr.aria-label]="(svc.visible ? 'إخفاء ' : 'إظهار ') + svc.nom"
                    (click)="toggleVisible(svc)"
                  >
                    <app-icon [name]="svc.visible ? 'eye' : 'eye-off'" [size]="18" />
                  </button>
                  <button
                    type="button"
                    [disabled]="busyId() === svc.id"
                    class="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    [attr.aria-label]="'حذف ' + svc.nom"
                    (click)="confirmDelete(svc)"
                  >
                    <app-icon name="trash" [size]="18" />
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="5" class="p-6 text-center text-slate-500">لا توجد خدمات بعد.</td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
  `,
})
export class ServicesAdminPage {
  protected readonly store = inject(ServicesAdminStore);
  private readonly confirmation = inject(ConfirmationService);
  private readonly messages = inject(MessageService);

  /** p-table needs a mutable array; the store view is readonly. */
  protected readonly rows = computed(() => [...this.store.services()]);
  protected readonly busyId = signal<string | null>(null);

  protected toggleVisible(svc: ServiceAdminView): void {
    this.busyId.set(svc.id);
    this.store.setVisible(svc.id, !svc.visible).subscribe({
      next: () => this.busyId.set(null),
      error: () => {
        this.busyId.set(null);
        this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر تحديث الحالة.' });
      },
    });
  }

  protected confirmDelete(svc: ServiceAdminView): void {
    this.confirmation.confirm({
      header: 'حذف الخدمة',
      message: `هل تريد حذف "${svc.nom}" نهائيًا؟ لا يمكن التراجع.`,
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.busyId.set(svc.id);
        this.store.remove(svc.id).subscribe({
          next: () => {
            this.busyId.set(null);
            this.messages.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الخدمة.' });
          },
          error: () => {
            this.busyId.set(null);
            this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر حذف الخدمة.' });
          },
        });
      },
    });
  }
}
