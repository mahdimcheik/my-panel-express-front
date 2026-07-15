import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ServicesAdminStore } from '../../../core/data/admin/services-admin-store';
import { ImageGalleryManager } from '../ui/image-gallery-manager';
import type { ServiceAdminView } from '../../../core/data/admin-view-models';

@Component({
  selector: 'app-service-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputText,
    Textarea,
    Checkbox,
    ButtonModule,
    Message,
    ImageGalleryManager,
  ],
  template: `
    <div class="mx-auto max-w-3xl">
      <a routerLink="/admin/services" class="text-sm text-brand-700 hover:underline">
        → العودة إلى الخدمات
      </a>
      <h1 class="mt-2 text-2xl font-bold text-brand-900">
        {{ isEdit() ? 'تعديل الخدمة' : 'خدمة جديدة' }}
      </h1>

      <div class="mt-4" aria-live="assertive">
        @if (errorMessage()) {
          <p-message severity="error" styleClass="w-full">{{ errorMessage() }}</p-message>
        }
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="mt-4 flex flex-col gap-5" novalidate>
        <div class="flex flex-col gap-2">
          <label for="svc-nom" class="font-medium text-brand-900">الاسم</label>
          <input
            pInputText
            id="svc-nom"
            formControlName="nom"
            class="w-full"
            maxlength="200"
            [attr.aria-invalid]="isInvalid('nom')"
            aria-describedby="svc-nom-error"
          />
          @if (isInvalid('nom')) {
            <small id="svc-nom-error" class="text-red-600">الاسم مطلوب (200 حرف كحد أقصى).</small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="svc-desc" class="font-medium text-brand-900">الوصف</label>
          <textarea
            pTextarea
            id="svc-desc"
            formControlName="description"
            rows="5"
            class="w-full"
            maxlength="5000"
            [attr.aria-invalid]="isInvalid('description')"
            aria-describedby="svc-desc-error"
          ></textarea>
          @if (isInvalid('description')) {
            <small id="svc-desc-error" class="text-red-600">الوصف مطلوب.</small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="svc-avantages" class="font-medium text-brand-900">
            المزايا <span class="font-normal text-slate-500">(ميزة واحدة في كل سطر)</span>
          </label>
          <textarea
            pTextarea
            id="svc-avantages"
            formControlName="avantages"
            rows="4"
            class="w-full"
            maxlength="2000"
          ></textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label for="svc-ordre" class="font-medium text-brand-900">الترتيب</label>
          <input
            pInputText
            id="svc-ordre"
            type="number"
            min="0"
            formControlName="ordre"
            dir="ltr"
            class="w-40"
          />
        </div>

        <div class="flex items-center gap-2">
          <p-checkbox inputId="svc-visible" formControlName="visible" [binary]="true" />
          <label for="svc-visible" class="font-medium text-brand-900">ظاهرة في الموقع</label>
        </div>

        <div class="flex gap-3">
          <p-button
            type="submit"
            [label]="isEdit() ? 'حفظ التغييرات' : 'إنشاء'"
            [loading]="submitting()"
            [disabled]="submitting()"
          />
          <p-button
            type="button"
            label="إلغاء"
            severity="secondary"
            [text]="true"
            routerLink="/admin/services"
          />
        </div>
      </form>

      @if (isEdit() && item(); as svc) {
        <hr class="my-8 border-slate-200" />
        <app-image-gallery-manager
          [images]="svc.images"
          [busy]="galleryBusy()"
          (filesSelected)="onFilesSelected($event)"
          (deleteImage)="onDeleteImage($event)"
          (reorder)="onReorder($event)"
        />
      } @else if (!isEdit()) {
        <p class="mt-8 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          يمكنك إضافة الصور بعد إنشاء الخدمة.
        </p>
      }
    </div>
  `,
})
export class ServiceFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(ServicesAdminStore);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);

  /** Route param; absent in create mode. */
  readonly id = input<string>();

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly galleryBusy = signal(false);
  protected readonly item = signal<ServiceAdminView | null>(null);

  protected isEdit(): boolean {
    return !!this.id();
  }

  protected readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    avantages: ['', [Validators.maxLength(2000)]],
    ordre: [0, [Validators.required, Validators.min(0)]],
    visible: [true],
  });

  ngOnInit(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.store.getOne(id).subscribe({
      next: (svc) => {
        this.item.set(svc);
        this.form.patchValue({
          nom: svc.nom,
          description: svc.description,
          avantages: svc.avantages.join('\n'),
          ordre: svc.ordre,
          visible: svc.visible,
        });
      },
      error: () => this.errorMessage.set('تعذّر تحميل الخدمة.'),
    });
  }

  protected isInvalid(control: 'nom' | 'description'): boolean {
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
    const value = this.form.getRawValue();
    const id = this.id();

    const request = id ? this.store.update(id, value) : this.store.create(value);
    request.subscribe({
      next: (svc) => {
        this.submitting.set(false);
        if (id) {
          this.messages.add({ severity: 'success', summary: 'تم', detail: 'تم حفظ التغييرات.' });
          void this.router.navigate(['/admin/services']);
        } else {
          this.messages.add({
            severity: 'success',
            summary: 'تم',
            detail: 'تم إنشاء الخدمة. يمكنك الآن إضافة الصور.',
          });
          void this.router.navigate(['/admin/services', svc.id]);
        }
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('تعذّر حفظ الخدمة. تحقّق من الحقول وحاول مجددًا.');
      },
    });
  }

  protected onFilesSelected(files: File[]): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.galleryBusy.set(true);
    this.store.uploadImages(id, files).subscribe({
      next: (svc) => {
        this.item.set(svc);
        this.galleryBusy.set(false);
      },
      error: () => {
        this.galleryBusy.set(false);
        this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر رفع الصور.' });
      },
    });
  }

  protected onDeleteImage(imageId: string): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.galleryBusy.set(true);
    this.store.deleteImage(id, imageId).subscribe({
      next: (svc) => {
        this.item.set(svc);
        this.galleryBusy.set(false);
      },
      error: () => {
        this.galleryBusy.set(false);
        this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر حذف الصورة.' });
      },
    });
  }

  protected onReorder(imageIds: string[]): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.galleryBusy.set(true);
    this.store.reorderImages(id, imageIds).subscribe({
      next: (svc) => {
        this.item.set(svc);
        this.galleryBusy.set(false);
      },
      error: () => {
        this.galleryBusy.set(false);
        this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر إعادة الترتيب.' });
      },
    });
  }
}
