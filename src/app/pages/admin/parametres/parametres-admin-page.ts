import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ParametresAdminStore } from '../../../core/data/admin/parametres-admin-store';
import { toUpdateParametres } from '../../../core/data/admin-mappers';
import type { ParametresAdminView } from '../../../core/data/admin-view-models';
import { CardGridSkeleton } from '../../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { LoadError } from '../../../shared/ui/load-error/load-error';

@Component({
  selector: 'app-parametres-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    Textarea,
    Message,
    CardGridSkeleton,
    LoadError,
  ],
  template: `
    <h1 class="text-2xl font-bold text-brand-900">إعدادات الموقع</h1>
    <p class="mt-1 text-slate-600">معلومات المؤسسة وبيانات الاتصال وروابط التواصل الاجتماعي.</p>

    <div class="mt-4" aria-live="assertive">
      @if (errorMessage()) {
        <p-message severity="error" styleClass="w-full">{{ errorMessage() }}</p-message>
      }
    </div>

    <div class="mt-6">
      @if (store.isLoading()) {
        <app-card-grid-skeleton [count]="2" />
      } @else if (store.failed()) {
        <app-load-error (retry)="store.reload()" />
      } @else {
        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          class="max-w-2xl space-y-6 rounded-card border border-slate-200 bg-white p-6 shadow-card"
        >
          <div>
            <label for="nom" class="mb-1 block font-medium text-slate-700">اسم المؤسسة</label>
            <input pInputText id="nom" formControlName="nomEntreprise" class="w-full" />
            @if (invalid('nomEntreprise')) {
              <p class="mt-1 text-sm text-red-600">هذا الحقل مطلوب.</p>
            }
          </div>

          <div>
            <label for="adresse" class="mb-1 block font-medium text-slate-700">العنوان</label>
            <input pInputText id="adresse" formControlName="adresse" class="w-full" />
            @if (invalid('adresse')) {
              <p class="mt-1 text-sm text-red-600">هذا الحقل مطلوب.</p>
            }
          </div>

          <div>
            <label for="telephones" class="mb-1 block font-medium text-slate-700">
              أرقام الهاتف
            </label>
            <textarea
              pTextarea
              id="telephones"
              formControlName="telephones"
              rows="3"
              dir="ltr"
              class="w-full"
            ></textarea>
            <p class="mt-1 text-sm text-slate-500">رقم واحد في كل سطر.</p>
          </div>

          @if (email()) {
            <div>
              <span class="mb-1 block font-medium text-slate-700">البريد الإلكتروني</span>
              <p class="text-slate-600" dir="ltr">{{ email() }}</p>
            </div>
          }

          <fieldset class="space-y-4">
            <legend class="font-medium text-slate-700">روابط التواصل الاجتماعي</legend>
            <div>
              <label for="facebook" class="mb-1 block text-sm text-slate-600">فيسبوك</label>
              <input pInputText id="facebook" formControlName="facebook" dir="ltr" class="w-full" />
            </div>
            <div>
              <label for="instagram" class="mb-1 block text-sm text-slate-600">إنستغرام</label>
              <input
                pInputText
                id="instagram"
                formControlName="instagram"
                dir="ltr"
                class="w-full"
              />
            </div>
            <div>
              <label for="whatsapp" class="mb-1 block text-sm text-slate-600">واتساب</label>
              <input pInputText id="whatsapp" formControlName="whatsApp" dir="ltr" class="w-full" />
            </div>
            <div>
              <label for="tiktok" class="mb-1 block text-sm text-slate-600">تيك توك</label>
              <input pInputText id="tiktok" formControlName="tikTok" dir="ltr" class="w-full" />
            </div>
          </fieldset>

          <div>
            <p-button
              type="submit"
              label="حفظ"
              [loading]="submitting()"
              [disabled]="submitting()"
            />
          </div>
        </form>
      }
    </div>
  `,
})
export class ParametresAdminPage {
  protected readonly store = inject(ParametresAdminStore);
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessageService);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly email = signal('');

  protected readonly form = this.fb.nonNullable.group({
    nomEntreprise: ['', Validators.required],
    adresse: ['', Validators.required],
    telephones: [''],
    facebook: [''],
    instagram: [''],
    whatsApp: [''],
    tikTok: [''],
  });

  constructor() {
    // Seed the form once the settings row has loaded (and after each reload).
    effect(() => {
      const p = this.store.parametres();
      if (p) {
        untracked(() => this.seed(p));
      }
    });
  }

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }

  private seed(p: ParametresAdminView): void {
    this.email.set(p.email);
    this.form.setValue({
      nomEntreprise: p.nomEntreprise,
      adresse: p.adresse,
      telephones: p.telephones.join('\n'),
      facebook: p.facebook,
      instagram: p.instagram,
      whatsApp: p.whatsApp,
      tikTok: p.tikTok,
    });
  }

  protected submit(): void {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.store.save(toUpdateParametres(this.form.getRawValue())).subscribe({
      next: () => {
        this.submitting.set(false);
        this.messages.add({ severity: 'success', summary: 'تم', detail: 'تم حفظ الإعدادات.' });
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('تعذّر الحفظ. تأكد من صحة البيانات وحاول مرة أخرى.');
      },
    });
  }
}
