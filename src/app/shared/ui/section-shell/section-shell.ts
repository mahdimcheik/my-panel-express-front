import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A labelled `<section>` with a heading and optional lead paragraph. */
@Component({
  selector: 'app-section-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.aria-labelledby]="headingId()" class="py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <header class="mb-10 max-w-2xl">
          <h2 [id]="headingId()" class="text-2xl font-bold text-brand-900 md:text-3xl dark:text-brand-100">
            {{ titre() }}
          </h2>
          @if (lead()) {
            <p class="mt-3 text-base text-slate-600 md:text-lg dark:text-slate-300">{{ lead() }}</p>
          }
        </header>
        <ng-content />
      </div>
    </section>
  `,
})
export class SectionShell {
  readonly titre = input.required<string>();
  readonly headingId = input.required<string>();
  readonly lead = input<string | null>(null);
}
