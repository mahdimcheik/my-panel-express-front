import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { HorairesAdminStore } from '../../../core/data/admin/horaires-admin-store';
import { toUpdateHoraire } from '../../../core/data/admin-mappers';
import { CardGridSkeleton } from '../../../shared/ui/card-grid-skeleton/card-grid-skeleton';
import { LoadError } from '../../../shared/ui/load-error/load-error';

interface DayControls {
  id: string;
  libelle: string;
  ferme: boolean;
  visible: boolean;
  heureOuverture: string;
  heureFermeture: string;
}

@Component({
  selector: 'app-horaires-admin-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, Checkbox, InputText, Message, CardGridSkeleton, LoadError],
  template: `
    <h1 class="text-2xl font-bold text-brand-900">أوقات العمل</h1>
    <p class="mt-1 text-slate-600">حدّد ساعات الفتح والإغلاق لكل يوم.</p>

    <div class="mt-4" aria-live="assertive">
      @if (errorMessage()) {
        <p-message severity="error" styleClass="w-full">{{ errorMessage() }}</p-message>
      }
    </div>

    <div class="mt-6">
      @if (store.isLoading()) {
        <app-card-grid-skeleton [count]="3" />
      } @else if (store.failed()) {
        <app-load-error (retry)="store.reload()" />
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()">
          <ul formArrayName="days" class="space-y-3">
            @for (grp of days.controls; track $index) {
              <li
                [formGroupName]="$index"
                class="flex flex-wrap items-center gap-4 rounded-card border border-slate-200 bg-white p-4 shadow-card"
              >
                <span class="w-24 font-semibold text-brand-900">{{ grp.value.libelle }}</span>

                <label class="flex items-center gap-2 text-sm">
                  <p-checkbox [inputId]="'ferme-' + $index" formControlName="ferme" [binary]="true" />
                  <span>مغلق</span>
                </label>

                <div class="flex items-center gap-2" [class.opacity-40]="grp.value.ferme">
                  <label [for]="'ouv-' + $index" class="text-sm text-slate-600">من</label>
                  <input
                    pInputText
                    [id]="'ouv-' + $index"
                    type="time"
                    formControlName="heureOuverture"
                    dir="ltr"
                    class="w-32"
                  />
                  <label [for]="'ferm-' + $index" class="text-sm text-slate-600">إلى</label>
                  <input
                    pInputText
                    [id]="'ferm-' + $index"
                    type="time"
                    formControlName="heureFermeture"
                    dir="ltr"
                    class="w-32"
                  />
                </div>

                <label class="ms-auto flex items-center gap-2 text-sm">
                  <p-checkbox
                    [inputId]="'vis-' + $index"
                    formControlName="visible"
                    [binary]="true"
                  />
                  <span>ظاهر في الموقع</span>
                </label>
              </li>
            }
          </ul>

          <div class="mt-6">
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
export class HorairesAdminPage {
  protected readonly store = inject(HorairesAdminStore);
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessageService);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.group({
    days: this.fb.array<FormGroup>([]),
  });

  get days(): FormArray<FormGroup> {
    return this.form.controls.days;
  }

  constructor() {
    // Seed the form array once the seven days have loaded (and after each reload).
    effect(() => {
      const days = this.store.horaires();
      if (days.length === 0) {
        return;
      }
      untracked(() => this.buildForm(days));
    });
  }

  private buildForm(days: readonly { id: string; libelle: string; ferme: boolean; visible: boolean; heureOuverture: string | null; heureFermeture: string | null }[]): void {
    const array = this.days;
    array.clear();
    for (const d of days) {
      array.push(
        this.fb.nonNullable.group<DayControls>({
          id: d.id,
          libelle: d.libelle,
          ferme: d.ferme,
          visible: d.visible,
          heureOuverture: d.heureOuverture ?? '',
          heureFermeture: d.heureFermeture ?? '',
        }),
      );
    }
  }

  protected submit(): void {
    this.errorMessage.set(null);
    this.submitting.set(true);
    const payload = this.days.controls.map((grp) => {
      const v = grp.getRawValue() as DayControls;
      return toUpdateHoraire({
        id: v.id,
        ferme: v.ferme,
        visible: v.visible,
        heureOuverture: v.heureOuverture || null,
        heureFermeture: v.heureFermeture || null,
      });
    });

    this.store.saveAll(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.messages.add({ severity: 'success', summary: 'تم', detail: 'تم حفظ أوقات العمل.' });
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('تعذّر الحفظ. تأكد من صحة الأوقات (الفتح قبل الإغلاق).');
      },
    });
  }
}
