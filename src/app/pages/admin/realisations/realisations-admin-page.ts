import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RealisationsAdminStore } from '../../../core/data/admin/realisations-admin-store';
import { Icon } from '../../../shared/ui/icon/icon';
import { CardGridSkeleton } from '../../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { LoadError } from '../../../shared/ui/load-error/load-error';
import type { RealisationAdminView } from '../../../core/data/admin-view-models';

@Component({
  selector: 'app-realisations-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TableModule, Tag, ButtonModule, Icon, CardGridSkeleton, LoadError],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-brand-900 dark:text-brand-100">الأعمال</h1>
      <a
        routerLink="/admin/realisations/new"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <app-icon name="plus" [size]="18" />
        عمل جديد
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
              <th scope="col">العنوان</th>
              <th scope="col" class="w-40">التصنيف</th>
              <th scope="col" class="w-32">التاريخ</th>
              <th scope="col" class="w-24">الصور</th>
              <th scope="col" class="w-28">الحالة</th>
              <th scope="col" class="w-40">إجراءات</th>
            </tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td class="font-medium text-brand-900 dark:text-brand-100">{{ item.titre }}</td>
              <td>{{ item.categorie }}</td>
              <td>
                @if (item.dateRealisation) {
                  <span dir="ltr">{{ item.dateRealisation.slice(0, 10) }}</span>
                } @else {
                  —
                }
              </td>
              <td>{{ item.images.length }}</td>
              <td>
                @if (item.visible) {
                  <p-tag severity="success" value="ظاهر" />
                } @else {
                  <p-tag severity="secondary" value="مخفي" />
                }
              </td>
              <td>
                <div class="flex items-center gap-1">
                  <a
                    [routerLink]="['/admin/realisations', item.id]"
                    class="rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    [attr.aria-label]="'تعديل ' + item.titre"
                  >
                    <app-icon name="edit" [size]="18" />
                  </a>
                  <button
                    type="button"
                    [disabled]="busyId() === item.id"
                    class="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                    [attr.aria-pressed]="item.visible"
                    [attr.aria-label]="(item.visible ? 'إخفاء ' : 'إظهار ') + item.titre"
                    (click)="toggleVisible(item)"
                  >
                    <app-icon [name]="item.visible ? 'eye' : 'eye-off'" [size]="18" />
                  </button>
                  <button
                    type="button"
                    [disabled]="busyId() === item.id"
                    class="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/40"
                    [attr.aria-label]="'حذف ' + item.titre"
                    (click)="confirmDelete(item)"
                  >
                    <app-icon name="trash" [size]="18" />
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="6" class="p-6 text-center text-slate-500 dark:text-slate-400">لا توجد أعمال بعد.</td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>
  `,
})
export class RealisationsAdminPage {
  protected readonly store = inject(RealisationsAdminStore);
  private readonly confirmation = inject(ConfirmationService);
  private readonly messages = inject(MessageService);

  /** p-table needs a mutable array; the store view is readonly. */
  protected readonly rows = computed(() => [...this.store.realisations()]);
  protected readonly busyId = signal<string | null>(null);

  protected toggleVisible(item: RealisationAdminView): void {
    this.busyId.set(item.id);
    this.store.setVisible(item.id, !item.visible).subscribe({
      next: () => this.busyId.set(null),
      error: () => {
        this.busyId.set(null);
        this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر تحديث الحالة.' });
      },
    });
  }

  protected confirmDelete(item: RealisationAdminView): void {
    this.confirmation.confirm({
      header: 'حذف العمل',
      message: `هل تريد حذف "${item.titre}" نهائيًا؟ لا يمكن التراجع.`,
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.busyId.set(item.id);
        this.store.remove(item.id).subscribe({
          next: () => {
            this.busyId.set(null);
            this.messages.add({ severity: 'success', summary: 'تم', detail: 'تم حذف العمل.' });
          },
          error: () => {
            this.busyId.set(null);
            this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر حذف العمل.' });
          },
        });
      },
    });
  }
}
