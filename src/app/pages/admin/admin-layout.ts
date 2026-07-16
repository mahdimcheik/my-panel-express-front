import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthStore } from '../../core/auth/auth-store';
import { Icon, type IconName } from '../../shared/ui/icon/icon';
import { ThemeToggle } from '../../shared/ui/theme-toggle/theme-toggle';

interface AdminNavItem {
  readonly label: string;
  readonly icon: IconName;
  readonly link: string;
}

const NAV: readonly AdminNavItem[] = [
  { label: 'لوحة القيادة', icon: 'dashboard', link: '/admin/dashboard' },
  { label: 'الخدمات', icon: 'briefcase', link: '/admin/services' },
  { label: 'الأعمال', icon: 'image', link: '/admin/realisations' },
  { label: 'أوقات العمل', icon: 'clock', link: '/admin/horaires' },
  { label: 'إعدادات الموقع', icon: 'settings', link: '/admin/parametres' },
];

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ButtonModule, Drawer, Toast, ConfirmDialog, Icon, ThemeToggle],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="flex min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <!-- Desktop sidebar (start side = right in RTL) -->
      <aside
        class="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-slate-200 bg-white lg:flex dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex h-16 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-700">
          <span class="text-lg font-bold text-brand-900 dark:text-brand-100">لوحة التحكم</span>
        </div>
        <nav class="flex-1 space-y-1 p-3" aria-label="تنقل لوحة التحكم">
          @for (item of nav; track item.link) {
            <a
              [routerLink]="item.link"
              routerLinkActive="bg-brand-50 text-brand-800 font-semibold dark:bg-brand-900/40 dark:text-brand-200"
              #rla="routerLinkActive"
              [attr.aria-current]="rla.isActive ? 'page' : null"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <app-icon [name]="item.icon" [size]="20" />
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Topbar -->
        <header
          class="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 dark:border-slate-700 dark:bg-slate-900/90"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg p-2 text-brand-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-controls="admin-menu"
            [attr.aria-expanded]="menuOpen()"
            aria-label="فتح القائمة"
            (click)="menuOpen.set(true)"
          >
            <app-icon name="menu" [size]="24" />
          </button>

          <a routerLink="/" class="text-sm text-brand-700 hover:underline dark:text-brand-300"
            >← العودة إلى الموقع</a
          >

          <div class="ms-auto flex items-center gap-3">
            <app-theme-toggle />
            @if (user(); as u) {
              <span class="hidden text-sm text-slate-600 sm:inline dark:text-slate-300" dir="ltr">{{
                u.email
              }}</span>
            }
            <p-button
              type="button"
              severity="secondary"
              [text]="true"
              size="small"
              (onClick)="logout()"
              ariaLabel="تسجيل الخروج"
            >
              <app-icon name="logout" [size]="18" />
              <span class="ms-1 hidden sm:inline">خروج</span>
            </p-button>
          </div>
        </header>

        <main class="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
    </div>

    <!-- Mobile navigation drawer -->
    <p-drawer
      [visible]="menuOpen()"
      (visibleChange)="menuOpen.set($event)"
      position="right"
      [modal]="true"
      [dismissible]="true"
      [closeOnEscape]="true"
      ariaCloseLabel="إغلاق القائمة"
      header="لوحة التحكم"
      styleClass="!w-72"
    >
      <nav id="admin-menu" class="space-y-1" aria-label="تنقل لوحة التحكم">
        @for (item of nav; track item.link) {
          <a
            [routerLink]="item.link"
            routerLinkActive="bg-brand-50 text-brand-800 font-semibold dark:bg-brand-900/40 dark:text-brand-200"
            (click)="menuOpen.set(false)"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <app-icon [name]="item.icon" [size]="20" />
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </p-drawer>

    <p-toast position="top-right" />
    <p-confirmdialog />
  `,
})
export class AdminLayout {
  private readonly auth = inject(AuthStore);

  protected readonly nav = NAV;
  protected readonly user = this.auth.currentUser;
  protected readonly menuOpen = signal(false);

  protected logout(): void {
    this.auth.logout();
  }
}
