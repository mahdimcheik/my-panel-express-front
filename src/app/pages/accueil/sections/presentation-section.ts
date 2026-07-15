import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SectionShell } from '../../../shared/ui/section-shell/section-shell';
import type { PresentationContent } from '../../../core/content/site-content.model';

@Component({
  selector: 'app-presentation-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShell],
  template: `
    <app-section-shell titre="من نحن" headingId="presentation-title">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div class="space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
          @for (paragraphe of presentation().paragraphes; track $index) {
            <p>{{ paragraphe }}</p>
          }
        </div>

        <ul class="grid grid-cols-3 gap-4">
          @for (stat of presentation().stats; track stat.libelle) {
            <li class="rounded-card bg-brand-50 p-5 text-center shadow-card">
              <span class="block text-2xl font-extrabold text-brand-700 md:text-3xl" dir="ltr">
                {{ stat.valeur }}
              </span>
              <span class="mt-1 block text-sm text-slate-600">{{ stat.libelle }}</span>
            </li>
          }
        </ul>
      </div>
    </app-section-shell>
  `,
})
export class PresentationSection {
  readonly presentation = input.required<PresentationContent>();
}
