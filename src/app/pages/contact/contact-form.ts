import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { ContactService } from '../../core/api/endpoints/contact/contact.service';
import type { CreateContactMessage } from '../../core/api/models';

@Component({
  selector: 'app-contact-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, Textarea, ButtonModule, Message],
  template: `
    <div aria-live="polite">
      @if (sent()) {
        <p-message severity="success" styleClass="w-full">
          شكرًا لك! تم إرسال رسالتك، وسنعاود التواصل معك قريبًا.
        </p-message>
      }
    </div>
    <div class="mt-3" aria-live="assertive">
      @if (errorMessage()) {
        <p-message severity="error" styleClass="w-full">{{ errorMessage() }}</p-message>
      }
    </div>

    <form [formGroup]="form" (ngSubmit)="submit()" class="mt-4 flex flex-col gap-5" novalidate>
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="contact-nom" class="font-medium text-brand-900 dark:text-brand-100">الاسم</label>
          <input
            pInputText
            id="contact-nom"
            formControlName="nom"
            autocomplete="name"
            class="w-full"
            maxlength="128"
            [attr.aria-invalid]="isInvalid('nom')"
            aria-describedby="contact-nom-error"
          />
          @if (isInvalid('nom')) {
            <small id="contact-nom-error" class="text-red-600 dark:text-red-400">الاسم مطلوب.</small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="contact-societe" class="font-medium text-brand-900 dark:text-brand-100">
            الشركة <span class="font-normal text-slate-500 dark:text-slate-400">(اختياري)</span>
          </label>
          <input
            pInputText
            id="contact-societe"
            formControlName="societe"
            autocomplete="organization"
            class="w-full"
            maxlength="128"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="contact-email" class="font-medium text-brand-900 dark:text-brand-100">البريد الإلكتروني</label>
          <input
            pInputText
            id="contact-email"
            type="email"
            dir="ltr"
            formControlName="email"
            autocomplete="email"
            class="w-full"
            maxlength="256"
            [attr.aria-invalid]="isInvalid('email')"
            aria-describedby="contact-email-error"
          />
          @if (isInvalid('email')) {
            <small id="contact-email-error" class="text-red-600 dark:text-red-400">أدخل بريدًا إلكترونيًا صحيحًا.</small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="contact-tel" class="font-medium text-brand-900 dark:text-brand-100">
            الهاتف <span class="font-normal text-slate-500 dark:text-slate-400">(اختياري)</span>
          </label>
          <input
            pInputText
            id="contact-tel"
            type="tel"
            dir="ltr"
            formControlName="telephone"
            autocomplete="tel"
            class="w-full"
            maxlength="32"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="contact-sujet" class="font-medium text-brand-900 dark:text-brand-100">الموضوع</label>
        <input
          pInputText
          id="contact-sujet"
          formControlName="sujet"
          class="w-full"
          maxlength="256"
          [attr.aria-invalid]="isInvalid('sujet')"
          aria-describedby="contact-sujet-error"
        />
        @if (isInvalid('sujet')) {
          <small id="contact-sujet-error" class="text-red-600 dark:text-red-400">الموضوع مطلوب.</small>
        }
      </div>

      <div class="flex flex-col gap-2">
        <label for="contact-message" class="font-medium text-brand-900 dark:text-brand-100">الرسالة</label>
        <textarea
          pTextarea
          id="contact-message"
          formControlName="message"
          rows="6"
          class="w-full"
          maxlength="5000"
          [attr.aria-invalid]="isInvalid('message')"
          aria-describedby="contact-message-error"
        ></textarea>
        @if (isInvalid('message')) {
          <small id="contact-message-error" class="text-red-600 dark:text-red-400">الرسالة مطلوبة.</small>
        }
      </div>

      <!-- Honeypot: hidden from humans, bots fill it and get silently dropped by the API. -->
      <div class="hidden" aria-hidden="true">
        <label for="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          formControlName="website"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <div>
        <p-button
          type="submit"
          label="إرسال"
          [loading]="submitting()"
          [disabled]="submitting()"
        />
      </div>
    </form>
  `,
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ContactService);

  protected readonly submitting = signal(false);
  protected readonly sent = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(128)]],
    societe: ['', [Validators.maxLength(128)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
    telephone: ['', [Validators.maxLength(32)]],
    sujet: ['', [Validators.required, Validators.maxLength(256)]],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
    website: [''],
  });

  protected isInvalid(control: 'nom' | 'email' | 'sujet' | 'message'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    this.errorMessage.set(null);
    this.sent.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const v = this.form.getRawValue();
    const payload: CreateContactMessage = {
      nom: v.nom.trim(),
      email: v.email.trim(),
      sujet: v.sujet.trim(),
      message: v.message.trim(),
      societe: v.societe.trim() || null,
      telephone: v.telephone.trim() || null,
      website: v.website || null,
    };

    this.api.postContact(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
        this.form.reset();
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('تعذّر إرسال الرسالة. حاول مرة أخرى لاحقًا.');
      },
    });
  }
}
