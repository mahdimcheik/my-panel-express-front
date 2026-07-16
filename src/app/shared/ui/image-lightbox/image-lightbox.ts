import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { RemoteImage } from '../remote-image/remote-image';
import { Icon } from '../icon/icon';
import type { ImageRef } from '../../../core/data/view-models';

/**
 * A full-screen image viewer. Shows one image at a time, fitted whole (never cropped),
 * with previous/next controls, a slide counter and keyboard support (Escape closes,
 * arrows navigate — right = previous, left = next, matching the RTL button layout).
 *
 * Reuses {@link RemoteImage}, so an expired presigned URL is re-signed on load error —
 * something `p-image` cannot do. Open state and the active index are two-way models so a
 * parent (e.g. {@link ImageCarousel}) can drive it.
 */
@Component({
  selector: 'app-image-lightbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RemoteImage, Icon],
  template: `
    @if (open()) {
      <div
        #dialog
        class="fixed inset-0 z-[1100] flex flex-col bg-black/90"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="label()"
        tabindex="-1"
        (keydown)="onKeydown($event)"
      >
        <div class="flex shrink-0 items-center justify-between p-3 text-white">
          @if (hasMultiple()) {
            <span class="text-sm tabular-nums" dir="ltr" aria-live="polite">
              {{ index() + 1 }} / {{ images().length }}
            </span>
          } @else {
            <span></span>
          }
          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="إغلاق"
            (click)="close()"
          >
            <app-icon name="close" [size]="24" />
          </button>
        </div>

        <div
          class="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4"
          (click)="onBackdropClick($event)"
        >
          @if (current(); as image) {
            <app-remote-image [image]="image" [fit]="'contain'" />
          }

          @if (hasMultiple()) {
            <!-- Previous: toward the start side (right in RTL) -->
            <button
              type="button"
              class="absolute top-1/2 start-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
              aria-label="الصورة السابقة"
              (click)="prev()"
            >
              <span class="-scale-x-100"><app-icon name="arrow-left" [size]="22" /></span>
            </button>

            <!-- Next: toward the end side (left in RTL) -->
            <button
              type="button"
              class="absolute top-1/2 end-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
              aria-label="الصورة التالية"
              (click)="next()"
            >
              <app-icon name="arrow-left" [size]="22" />
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class ImageLightbox {
  private readonly doc = inject(DOCUMENT);

  readonly images = input.required<readonly ImageRef[]>();
  readonly label = input('معرض الصور');

  /** Whether the viewer is shown. Two-way so a parent can open/close it. */
  readonly open = model(false);
  /** The active image index. Two-way so the opener can pick the starting slide. */
  readonly index = model(0);

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  /** The element focused before opening, restored on close. */
  private restoreFocus: HTMLElement | null = null;

  protected readonly hasMultiple = computed(() => this.images().length > 1);
  protected readonly current = computed<ImageRef | null>(
    () => this.images()[this.index()] ?? null,
  );

  constructor() {
    // Lock body scroll and move focus into the dialog while open; restore on close.
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (this.open() && el) {
        this.doc.body.style.overflow = 'hidden';
        el.focus();
      } else {
        this.doc.body.style.overflow = '';
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }

  protected close(): void {
    this.open.set(false);
    this.restoreFocus?.focus();
    this.restoreFocus = null;
  }

  /** Closes only when the dark surround itself is clicked, not the image or a control. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

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

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      // Right arrow points to the start side (previous in RTL); left to the end (next).
      case 'ArrowRight':
        this.prev();
        break;
      case 'ArrowLeft':
        this.next();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  /** Called by the opener to remember where focus should return after closing. */
  rememberFocus(el: HTMLElement | null): void {
    this.restoreFocus = el;
  }
}
