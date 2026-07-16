import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { MediaUrlService } from '../../../core/media/media-url.service';
import type { ImageRef } from '../../../core/data/view-models';

/**
 * Renders an API image whose presigned URL may expire. On the first load error it
 * re-signs the URL once from the object key; a second failure shows a grey placeholder
 * (never the broken-image glyph).
 */
@Component({
  selector: 'app-remote-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src(); as s) {
      <img
        [src]="s"
        [alt]="image().alt"
        [attr.aria-hidden]="image().alt ? null : 'true'"
        [loading]="priority() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null"
        decoding="async"
        [class]="imgClass()"
        (error)="onError()"
      />
    } @else {
      <div class="h-full w-full bg-slate-100 dark:bg-slate-800" aria-hidden="true"></div>
    }
  `,
})
export class RemoteImage {
  private readonly media = inject(MediaUrlService);

  readonly image = input.required<ImageRef>();
  readonly priority = input(false);
  /**
   * `'cover'` (default) fills and crops the host box — for fixed-ratio thumbnails.
   * `'contain'` shows the whole image, bounded by the viewport — for the lightbox.
   */
  readonly fit = input<'cover' | 'contain'>('cover');

  protected readonly imgClass = computed(() =>
    this.fit() === 'contain'
      ? 'mx-auto max-h-[85vh] max-w-[95vw] object-contain'
      : 'h-full w-full object-cover',
  );

  /** Resets to the source URL whenever the input image changes. */
  protected readonly src = linkedSignal<ImageRef, string | null>({
    source: this.image,
    computation: (img) => img.url,
  });

  private readonly retried = signal(false);

  protected onError(): void {
    const key = this.image().objectKey;
    if (this.retried() || !key) {
      this.src.set(null);
      return;
    }
    this.retried.set(true);
    this.media.refresh(key).subscribe({
      next: (url) => this.src.set(url),
      error: () => this.src.set(null),
    });
  }
}
