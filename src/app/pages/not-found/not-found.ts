import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <p class="text-5xl font-extrabold text-brand-700 dark:text-brand-300" dir="ltr">404</p>
      <h1 class="mt-4 text-2xl font-bold text-brand-900 dark:text-brand-100">الصفحة غير موجودة</h1>
      <p class="mt-3 text-slate-600 dark:text-slate-300">عذرًا، الصفحة التي تبحث عنها غير متوفرة.</p>
      <a
        routerLink="/"
        class="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        العودة إلى الرئيسية
      </a>
    </div>
  `,
})
export class NotFound {}
