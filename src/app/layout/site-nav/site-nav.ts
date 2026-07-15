import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SITE_CONTENT } from '../../core/content/site-content.token';

/** The list of primary navigation links, shared by the desktop bar and the mobile drawer. */
@Component({
  selector: 'app-site-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <ul [class]="orientation() === 'vertical' ? 'flex flex-col gap-1' : 'flex items-center gap-2'">
      @for (link of links; track link.path) {
        <li>
          <a
            [routerLink]="link.path"
            routerLinkActive="text-brand-700 font-bold"
            #rla="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: link.exact }"
            [attr.aria-current]="rla.isActive ? 'page' : null"
            (click)="navigate.emit()"
            class="block rounded-md px-3 py-2 font-medium text-slate-700 transition-colors hover:text-brand-700"
          >
            {{ link.label }}
          </a>
        </li>
      }
    </ul>
  `,
})
export class SiteNav {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly navigate = output<void>();

  protected readonly links = inject(SITE_CONTENT).nav;
}
