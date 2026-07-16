import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Drawer } from 'primeng/drawer';
import { ParametresStore } from '../../core/data/parametres-store';
import { Icon } from '../../shared/ui/icon/icon';
import { ThemeToggle } from '../../shared/ui/theme-toggle/theme-toggle';
import { SiteNav } from '../site-nav/site-nav';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage, Drawer, Icon, ThemeToggle, SiteNav],
  template: `
    <header
      class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-slate-700 dark:bg-slate-900/90 dark:supports-[backdrop-filter]:bg-slate-900/75"
    >
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a routerLink="/" class="flex items-center gap-3" aria-label="الصفحة الرئيسية">
          <img ngSrc="/logo.svg" width="40" height="40" alt="" priority class="h-10 w-10" />
          <span class="text-lg font-bold text-brand-900 dark:text-brand-100">{{
            params().nomEntreprise
          }}</span>
        </a>

        <nav class="hidden md:block" aria-label="التنقل الرئيسي">
          <app-site-nav />
        </nav>

        <div class="flex items-center gap-2">
          <app-theme-toggle />

          <a
            routerLink="/contact"
            class="hidden rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-block"
          >
            اطلب عرض سعر
          </a>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg p-2 text-brand-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-controls="mobile-menu"
            [attr.aria-expanded]="open()"
            [attr.aria-label]="open() ? 'إغلاق القائمة' : 'فتح القائمة'"
            (click)="open.set(true)"
          >
            <app-icon name="menu" [size]="24" />
          </button>
        </div>
      </div>
    </header>

    <p-drawer
      [visible]="open()"
      (visibleChange)="open.set($event)"
      position="right"
      [modal]="true"
      [blockScroll]="true"
      [closeOnEscape]="true"
      [dismissible]="true"
      ariaCloseLabel="إغلاق القائمة"
      header="القائمة"
      styleClass="!w-72"
    >
      <nav id="mobile-menu" aria-label="التنقل الرئيسي">
        <app-site-nav orientation="vertical" (navigate)="open.set(false)" />
        <a
          routerLink="/contact"
          (click)="open.set(false)"
          class="mt-4 block rounded-lg bg-brand-600 px-4 py-2 text-center font-semibold text-white hover:bg-brand-700"
        >
          اطلب عرض سعر
        </a>
      </nav>
    </p-drawer>
  `,
})
export class SiteHeader {
  protected readonly params = inject(ParametresStore).parametres;
  protected readonly open = signal(false);
}
