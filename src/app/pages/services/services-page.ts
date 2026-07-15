import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-services-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <h1 class="text-3xl font-bold text-brand-900">خدماتنا</h1>
      <p class="mt-4 text-lg text-slate-600">قريباً…</p>
    </div>
  `,
})
export class ServicesPage {}
