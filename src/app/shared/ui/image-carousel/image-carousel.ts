import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { RemoteImage } from '../remote-image/remote-image';
import { Icon } from '../icon/icon';
import type { ImageRef } from '../../../core/data/view-models';

/**
 * A simple one-at-a-time image carousel. RTL-aware and keyboard-accessible: previous
 * sits on the start side, next on the end side, with dot controls. Falls back to a grey
 * placeholder when there are no images, and hides its controls for a single image.
 */
@Component({
  selector: 'app-image-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RemoteImage, Icon],
  template: `
    <div class="relative h-full w-full" role="group" aria-roledescription="معرض صور" [attr.aria-label]="label()">
      @if (current(); as image) {
        <app-remote-image [image]="image" [priority]="priority()" />
      } @else {
        <div class="h-full w-full bg-slate-100" aria-hidden="true"></div>
      }

      @if (hasMultiple()) {
        <!-- Previous: toward the start side (right in RTL) -->
        <button
          type="button"
          class="absolute top-1/2 start-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-900 shadow-sm transition-colors hover:bg-white"
          aria-label="الصورة السابقة"
          (click)="prev()"
        >
          <span class="-scale-x-100"><app-icon name="arrow-left" [size]="18" /></span>
        </button>

        <!-- Next: toward the end side (left in RTL) -->
        <button
          type="button"
          class="absolute top-1/2 end-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-900 shadow-sm transition-colors hover:bg-white"
          aria-label="الصورة التالية"
          (click)="next()"
        >
          <app-icon name="arrow-left" [size]="18" />
        </button>

        <div class="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
          @for (image of images(); track $index) {
            <button
              type="button"
              class="h-2 rounded-full transition-all"
              [class]="$index === index() ? 'w-4 bg-white' : 'w-2 bg-white/60 hover:bg-white/90'"
              [attr.aria-label]="'الانتقال إلى الصورة ' + ($index + 1)"
              [attr.aria-current]="$index === index() ? 'true' : null"
              (click)="index.set($index)"
            ></button>
          }
        </div>
      }
    </div>
  `,
})
export class ImageCarousel {
  readonly images = input.required<readonly ImageRef[]>();
  readonly priority = input(false);
  readonly label = input('معرض الصور');

  /** Resets to the first slide whenever the image set changes. */
  protected readonly index = linkedSignal<readonly ImageRef[], number>({
    source: this.images,
    computation: () => 0,
  });

  protected readonly hasMultiple = computed(() => this.images().length > 1);
  protected readonly current = computed<ImageRef | null>(() => this.images()[this.index()] ?? null);

  protected next(): void {
    const len = this.images().length;
    if (len > 0) {
      this.index.set((this.index() + 1) % len);
    }
  }

  protected prev(): void {
    const len = this.images().length;
    if (len > 0) {
      this.index.set((this.index() - 1 + len) % len);
    }
  }
}
