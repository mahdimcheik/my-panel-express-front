import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-24 text-start sm:px-6">
      <h1 class="text-3xl font-bold text-brand-900">لوحة التحكم</h1>
      @if (user(); as u) {
        <p class="mt-4 text-lg text-slate-600">
          مرحبًا، <span dir="ltr">{{ u.email }}</span>
        </p>
      }
      <p-button
        type="button"
        label="تسجيل الخروج"
        severity="secondary"
        class="mt-8 inline-block"
        (onClick)="logout()"
      />
    </div>
  `,
})
export class AdminPage implements OnInit {
  private readonly store = inject(AuthStore);

  protected readonly user = this.store.currentUser;

  ngOnInit(): void {
    this.store.refreshUser();
  }

  protected logout(): void {
    this.store.logout();
  }
}
