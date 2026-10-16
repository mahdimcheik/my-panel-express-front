import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { HeroContent } from '../../../core/content/site-content.model';
import { RobotModel } from '../../../shared/ui/model-viewer/robot-model';

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink, RobotModel],
  template: `
    <section class="relative isolate flex min-h-[70svh] items-center overflow-hidden">
      @if (hero().image; as image) {
        <img [ngSrc]="image" fill priority alt="" class="object-cover" />
      } @else {
        <div class="absolute inset-0 bg-gradient-to-bl from-brand-900 to-brand-700"></div>
      }
      <div class="absolute inset-0 bg-gradient-to-l from-brand-950/85 to-brand-900/45"></div>

      <div
        class="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-20 text-start sm:px-6 md:grid-cols-2"
      >
        <div class="max-w-2xl">
          <h1 class="text-3xl font-extrabold leading-tight text-white md:text-5xl">
            {{ hero().titre }}
          </h1>
          <p class="mt-5 text-lg text-brand-50 md:text-xl">{{ hero().slogan }}</p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a
              [routerLink]="hero().ctaPrimary.path"
              class="rounded-lg bg-accent-500 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-accent-400"
            >
              {{ hero().ctaPrimary.label }}
            </a>
            <a
              [routerLink]="hero().ctaSecondary.path"
              class="rounded-lg border border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {{ hero().ctaSecondary.label }}
            </a>
          </div>
        </div>
        @if (hero().model; as model) {
          <app-robot-model [src]="model" class="h-72 w-full md:h-[28rem]" />
        }
      </div>
    </section>
  `,
})
export class HeroSection {
  readonly hero = input.required<HeroContent>();
}
