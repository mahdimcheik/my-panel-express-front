import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  input,
  signal,
} from '@angular/core';

/**
 * Decorative animated 3D model. `@google/model-viewer` (three.js) is imported
 * lazily after the first render so it stays out of the initial bundle.
 */
@Component({
  selector: 'app-robot-model',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'block',
    'aria-hidden': 'true',
    '(pointerenter)': 'hovered.set(true)',
    '(pointerleave)': 'hovered.set(false)',
  },
  template: `
    @if (ready()) {
      <model-viewer
        [attr.src]="src()"
        [attr.animation-name]="currentAnimation()"
        animation-crossfade-duration="400"
        [attr.autoplay]="reducedMotion() ? null : ''"
        alt=""
        camera-orbit="-30deg 80deg auto"
        disable-zoom
        disable-tap
        interaction-prompt="none"
        shadow-intensity="1"
        exposure="1"
        class="block size-full"
        style="--poster-color: transparent; background-color: transparent"
      ></model-viewer>
    }
  `,
})
export class RobotModel {
  readonly src = input.required<string>();
  readonly animation = input('CharacterArmature|Idle');
  readonly hoverAnimation = input('CharacterArmature|Run');

  protected readonly ready = signal(false);
  protected readonly reducedMotion = signal(false);
  protected readonly hovered = signal(false);
  protected readonly currentAnimation = computed(() =>
    this.hovered() && !this.reducedMotion() ? this.hoverAnimation() : this.animation(),
  );

  constructor() {
    afterNextRender(() => {
      this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      import('@google/model-viewer').then(() => this.ready.set(true));
    });
  }
}
