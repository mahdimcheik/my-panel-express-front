import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-contact-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <section aria-labelledby="cta-title" class="bg-brand-800">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6"
      >
        <h2 id="cta-title" class="text-2xl font-bold text-white md:text-3xl">
          هل لديك مشروع؟ لنبدأ العمل معًا
        </h2>
        <p class="max-w-xl text-brand-50">
          تواصل معنا اليوم للحصول على عرض سعر مجاني ومخصّص لاحتياجاتك.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a
            routerLink="/contact"
            class="rounded-lg bg-accent-500 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-accent-400"
          >
            اتصل بنا
          </a>
          <a
            [href]="'tel:' + telephone()"
            class="inline-flex items-center gap-2 rounded-lg border border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            <app-icon name="phone" [size]="18" />
            <span dir="ltr">{{ telephone() }}</span>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class ContactCta {
  /** Primary phone number for the `tel:` shortcut. */
  readonly telephone = input.required<string>();
}
