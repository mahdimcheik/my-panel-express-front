import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SiteHeader } from './layout/site-header/site-header';
import { SiteFooter } from './layout/site-footer/site-footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  template: `
    <a
      href="#main"
      class="sr-only rounded-lg bg-brand-700 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50"
    >
      تخطَّ إلى المحتوى الرئيسي
    </a>

    <!-- The back-office brings its own shell (sidebar + topbar). -->
    @if (!isAdmin()) {
      <app-site-header />
    }

    <main #main id="main" tabindex="-1" class="outline-none">
      <router-outlet />
    </main>

    @if (!isAdmin()) {
      <app-site-footer />
    }
  `,
})
export class App implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /** Public site chrome is hidden under `/admin`, which renders its own layout. */
  protected readonly isAdmin = signal(this.router.url.startsWith('/admin'));

  ngAfterViewInit(): void {
    // Move focus to <main> on subsequent navigations so keyboard/SR users are not
    // left parked in the header after a route change (skip the initial load).
    const sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isAdmin.set(e.urlAfterRedirects.startsWith('/admin'));
        this.main().nativeElement.focus({ preventScroll: true });
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
