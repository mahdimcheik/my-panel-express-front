import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Discreet inline strip inviting the user to retry a failed load. */
@Component({
  selector: 'app-load-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="status"
      class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <span>{{ message() }}</span>
      <button
        type="button"
        class="rounded-md bg-amber-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-amber-700"
        (click)="retry.emit()"
      >
        إعادة المحاولة
      </button>
    </div>
  `,
})
export class LoadError {
  readonly message = input('تعذّر تحميل أحدث البيانات.');
  readonly retry = output<void>();
}
