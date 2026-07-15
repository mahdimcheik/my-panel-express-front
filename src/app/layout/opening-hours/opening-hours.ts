import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HorairesStore } from '../../core/data/horaires-store';

/** Weekly opening-hours list, rendered as a description list. */
@Component({
  selector: 'app-opening-hours',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dl class="space-y-2 text-sm">
      @for (h of store.horaires(); track h.jour) {
        <div class="flex items-center justify-between gap-4">
          <dt class="text-slate-300">{{ h.libelle }}</dt>
          <dd [dir]="h.ferme ? 'rtl' : 'ltr'" [class]="h.ferme ? 'text-slate-400' : 'text-white'">
            {{ h.ferme ? 'مغلق' : h.plage }}
          </dd>
        </div>
      }
    </dl>
  `,
})
export class OpeningHours {
  protected readonly store = inject(HorairesStore);
}
