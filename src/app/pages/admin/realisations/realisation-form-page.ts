import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { RealisationsAdminStore } from '../../../core/data/admin/realisations-admin-store';
import { ImageGalleryManager } from '../ui/image-gallery-manager';
import type { RealisationAdminView } from '../../../core/data/admin-view-models';

@Component({
  selector: 'app-realisation-form-page',
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
      <a routerLink="/admin/realisations" class="text-sm text-brand-700 hover:underline">
        → العودة إلى الأعمال
      </a>
      <h1 class="mt-2 text-2xl font-bold text-brand-900">
        {{ isEdit() ? 'تعديل العمل' : 'عمل جديد' }}
      </h1>

      <div class="mt-4" aria-live="assertive">
        @if (errorMessage()) {
          <p-message severity="error" styleClass="w-full">{{ errorMessage() }}</p-message>
        }
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="mt-4 flex flex-col gap-5" novalidate>
        <div class="flex flex-col gap-2">
          <label for="rea-titre" class="font-medium text-brand-900">العنوان</label>
          <input
            pInputText
            id="rea-titre"
            formControlName="titre"
            class="w-full"
            maxlength="200"
            [attr.aria-invalid]="isInvalid('titre')"
            aria-describedby="rea-titre-error"
          />
          @if (isInvalid('titre')) {
            <small id="rea-titre-error" class="text-red-600">العنوان مطلوب (200 حرف كحد أقصى).</small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="rea-cat" class="font-medium text-brand-900">التصنيف</label>
          <input
            pInputText
            id="rea-cat"
            formControlName="categorie"
            class="w-full"
            maxlength="100"
            [attr.aria-invalid]="isInvalid('categorie')"
            aria-describedby="rea-cat-error"
          />
          @if (isInvalid('categorie')) {
            <small id="rea-cat-error" class="text-red-600">التصنيف مطلوب.</small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="rea-date" class="font-medium text-brand-900">تاريخ الإنجاز</label>
          <input
            pInputText
            id="rea-date"
            type="date"
            formControlName="dateRealisation"
            dir="ltr"
            class="w-56"
            [attr.aria-invalid]="isInvalid('dateRealisation')"
            aria-describedby="rea-date-error"
          />
          @if (isInvalid('dateRealisation')) {
            <small id="rea-date-error" class="text-red-600">التاريخ مطلوب.</small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <label for="rea-desc" class="font-medium text-brand-900">الوصف</label>
          <textarea
            pTextarea
            id="rea-desc"
            formControlName="description"
            rows="5"
            class="w-full"
            maxlength="5000"
            [attr.aria-invalid]="isInvalid('description')"
            aria-describedby="rea-desc-error"
          ></textarea>
          @if (isInvalid('description')) {
            <small id="rea-desc-error" class="text-red-600">الوصف مطلوب.</small>
          }
        </div>

        <div class="flex items-center gap-2">
          <p-checkbox inputId="rea-visible" formControlName="visible" [binary]="true" />
          <label for="rea-visible" class="font-medium text-brand-900">ظاهر في الموقع</label>
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
            routerLink="/admin/realisations"
          />
        </div>
      </form>

      @if (isEdit() && item(); as rea) {
        <hr class="my-8 border-slate-200" />
        <app-image-gallery-manager
          [images]="rea.images"
          [busy]="galleryBusy()"
          (filesSelected)="onFilesSelected($event)"
          (deleteImage)="onDeleteImage($event)"
          (reorder)="onReorder($event)"
        />
      } @else if (!isEdit()) {
        <p class="mt-8 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          يمكنك إضافة الصور بعد إنشاء العمل.
        </p>
      }
    </div>
  `,
})
export class RealisationFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(RealisationsAdminStore);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);

  readonly id = input<string>();

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly galleryBusy = signal(false);
  protected readonly item = signal<RealisationAdminView | null>(null);

  protected isEdit(): boolean {
    return !!this.id();
  }

  protected readonly form = this.fb.nonNullable.group({
    titre: ['', [Validators.required, Validators.maxLength(200)]],
    categorie: ['', [Validators.required, Validators.maxLength(100)]],
    dateRealisation: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    visible: [true],
  });

  ngOnInit(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.store.getOne(id).subscribe({
      next: (rea) => {
        this.item.set(rea);
        this.form.patchValue({
          titre: rea.titre,
          categorie: rea.categorie,
          dateRealisation: rea.dateRealisation ? rea.dateRealisation.slice(0, 10) : '',
          description: rea.description,
          visible: rea.visible,
        });
      },
      error: () => this.errorMessage.set('تعذّر تحميل العمل.'),
    });
  }

  protected isInvalid(control: 'titre' | 'categorie' | 'dateRealisation' | 'description'): boolean {
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
      next: (rea) => {
        this.submitting.set(false);
        if (id) {
          this.messages.add({ severity: 'success', summary: 'تم', detail: 'تم حفظ التغييرات.' });
          void this.router.navigate(['/admin/realisations']);
        } else {
          this.messages.add({
            severity: 'success',
            summary: 'تم',
            detail: 'تم إنشاء العمل. يمكنك الآن إضافة الصور.',
          });
          void this.router.navigate(['/admin/realisations', rea.id]);
        }
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('تعذّر حفظ العمل. تحقّق من الحقول وحاول مجددًا.');
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
      next: (rea) => {
        this.item.set(rea);
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
      next: (rea) => {
        this.item.set(rea);
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
      next: (rea) => {
        this.item.set(rea);
        this.galleryBusy.set(false);
      },
      error: () => {
        this.galleryBusy.set(false);
        this.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تعذّر إعادة الترتيب.' });
      },
    });
  }
}
