import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, Password, ButtonModule, Message],
  template: `
    <div class="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 class="text-start text-2xl font-bold text-brand-900">تسجيل الدخول</h1>
      <p class="mt-2 text-start text-slate-600">الدخول إلى لوحة تحكم المشرف.</p>

      <div class="mt-6" aria-live="assertive">
        @if (errorMessage()) {
          <p-message severity="error" styleClass="w-full">{{ errorMessage() }}</p-message>
        }
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="mt-4 flex flex-col gap-5" novalidate>
        <div class="flex flex-col gap-2">
          <label for="login-email" class="text-start font-medium text-brand-900">
            البريد الإلكتروني
          </label>
          <input
            pInputText
            id="login-email"
            type="email"
            dir="ltr"
            formControlName="email"
            autocomplete="username"
            class="w-full"
            [attr.aria-invalid]="isInvalid('email')"
            aria-describedby="login-email-error"
          />
          @if (isInvalid('email')) {
            <small id="login-email-error" class="text-start text-red-600">
              أدخل بريدًا إلكترونيًا صحيحًا.
            </small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="login-password" class="text-start font-medium text-brand-900">
            كلمة المرور
          </label>
          <p-password
            inputId="login-password"
            formControlName="password"
            autocomplete="current-password"
            [feedback]="false"
            [toggleMask]="true"
            class="w-full"
            inputStyleClass="w-full"
            [attr.aria-invalid]="isInvalid('password')"
            aria-describedby="login-password-error"
          />
          @if (isInvalid('password')) {
            <small id="login-password-error" class="text-start text-red-600">
              كلمة المرور مطلوبة.
            </small>
          }
        </div>

        <p-button
          type="submit"
          label="دخول"
          styleClass="w-full"
          [loading]="submitting()"
          [disabled]="submitting()"
        />
      </form>
    </div>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected isInvalid(control: 'email' | 'password'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.store.login(this.form.getRawValue()).subscribe({
      next: () => {
        void this.router.navigate(['/admin']);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      },
    });
  }
}
