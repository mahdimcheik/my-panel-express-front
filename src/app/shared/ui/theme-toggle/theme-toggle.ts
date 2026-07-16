import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Popover } from 'primeng/popover';
import { Icon, type IconName } from '../icon/icon';
import { ThemeStore, type ThemeChoice } from '../../../core/theme/theme-store';

interface ThemeOption {
  readonly value: ThemeChoice;
  readonly label: string;
  readonly icon: IconName;
}

const OPTIONS: readonly ThemeOption[] = [
  { value: 'light', label: 'فاتح', icon: 'sun' },
  { value: 'dark', label: 'داكن', icon: 'moon' },
  { value: 'system', label: 'حسب النظام', icon: 'monitor' },
];

/** Light / Dark / System theme picker. Persists via {@link ThemeStore}. */
@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Popover, Icon],
  template: `
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg p-2 text-brand-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-haspopup="dialog"
      aria-label="تبديل المظهر"
      (click)="op.toggle($event)"
    >
      <app-icon [name]="currentIcon()" [size]="20" />
    </button>

    <p-popover #op>
      <div
        role="radiogroup"
        aria-label="اختيار المظهر"
        class="flex min-w-44 flex-col gap-1 p-1"
      >
        @for (opt of options; track opt.value) {
          <label
            class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 has-[:checked]:bg-brand-50 has-[:checked]:font-semibold has-[:checked]:text-brand-800 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:has-[:checked]:bg-brand-900/40 dark:has-[:checked]:text-brand-200"
          >
            <input
              type="radio"
              name="theme-choice"
              class="sr-only"
              [value]="opt.value"
              [checked]="preference() === opt.value"
              (change)="select(opt.value)"
            />
            <app-icon [name]="opt.icon" [size]="18" />
            <span>{{ opt.label }}</span>
            @if (preference() === opt.value) {
              <app-icon name="check" [size]="16" class="ms-auto" />
            }
          </label>
        }
      </div>
    </p-popover>
  `,
})
export class ThemeToggle {
  private readonly theme = inject(ThemeStore);

  protected readonly options = OPTIONS;
  protected readonly preference = this.theme.preference;

  protected readonly currentIcon = computed<IconName>(() => {
    switch (this.preference()) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      default:
        return 'monitor';
    }
  });

  protected select(choice: ThemeChoice): void {
    this.theme.setPreference(choice);
  }
}
