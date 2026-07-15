import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RemoteImage } from '../../../shared/ui/remote-image/remote-image';
import { Icon } from '../../../shared/ui/icon/icon';
import type { AdminImage } from '../../../core/data/admin-view-models';

/**
 * Manages a gallery: add images, reorder with up/down buttons (accessible — no drag-only),
 * and delete. Dumb component — the parent form wires the events to its admin store.
 */
@Component({
  selector: 'app-image-gallery-manager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RemoteImage, Icon],
  template: `
    <section aria-labelledby="gallery-heading" class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <h2 id="gallery-heading" class="text-lg font-semibold text-brand-900">الصور</h2>
        <div>
          <input
            #fileInput
            type="file"
            accept="image/*"
            multiple
            class="sr-only"
            (change)="onFilesPicked($event)"
          />
          <button
            type="button"
            [disabled]="busy()"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            (click)="fileInput.click()"
          >
            <app-icon name="upload" [size]="18" />
            إضافة صور
          </button>
        </div>
      </div>

      @if (images().length === 0) {
        <p class="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
          لا توجد صور بعد. أضف صورة واحدة أو أكثر.
        </p>
      } @else {
        <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          @for (img of images(); track img.id; let i = $index, first = $first, last = $last) {
            <li class="overflow-hidden rounded-card border border-slate-200 bg-white shadow-card">
              <div class="aspect-square w-full bg-slate-100">
                <app-remote-image [image]="img.ref" />
              </div>
              <div class="flex items-center justify-between gap-1 p-2">
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    [disabled]="busy() || first"
                    class="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    [attr.aria-label]="'نقل الصورة ' + (i + 1) + ' للأمام'"
                    (click)="moveUp(i)"
                  >
                    <app-icon name="arrow-up" [size]="18" />
                  </button>
                  <button
                    type="button"
                    [disabled]="busy() || last"
                    class="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    [attr.aria-label]="'نقل الصورة ' + (i + 1) + ' للخلف'"
                    (click)="moveDown(i)"
                  >
                    <app-icon name="arrow-down" [size]="18" />
                  </button>
                </div>
                <button
                  type="button"
                  [disabled]="busy()"
                  class="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                  [attr.aria-label]="'حذف الصورة ' + (i + 1)"
                  (click)="deleteImage.emit(img.id)"
                >
                  <app-icon name="trash" [size]="18" />
                </button>
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class ImageGalleryManager {
  readonly images = input.required<readonly AdminImage[]>();
  readonly busy = input(false);

  readonly filesSelected = output<File[]>();
  readonly deleteImage = output<string>();
  /** Emits the full list of image ids in the new order. */
  readonly reorder = output<string[]>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected onFilesPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length > 0) {
      this.filesSelected.emit(files);
    }
    input.value = '';
  }

  protected moveUp(index: number): void {
    this.swap(index, index - 1);
  }

  protected moveDown(index: number): void {
    this.swap(index, index + 1);
  }

  private swap(a: number, b: number): void {
    const ids = this.images().map((img) => img.id);
    if (a < 0 || b < 0 || a >= ids.length || b >= ids.length) {
      return;
    }
    [ids[a], ids[b]] = [ids[b], ids[a]];
    this.reorder.emit(ids);
  }
}
