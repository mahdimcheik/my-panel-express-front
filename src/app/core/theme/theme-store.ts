import { Injectable, computed, effect, signal } from '@angular/core';

export type ThemeChoice = 'light' | 'dark' | 'system';

const THEME_KEY = 'mpe.theme';

/**
 * Holds the user's colour-scheme preference. Persisted to `localStorage` and
 * applied imperatively to `<html>`: the `.app-dark` class drives both Tailwind's
 * `dark:` variant and PrimeNG's `darkModeSelector` (see app.config.ts), and
 * `style.colorScheme` fixes native controls/scrollbars.
 *
 * The very first paint is handled by the inline script in `index.html`; this
 * store owns everything after Angular boots (toggling, live OS-change following).
 */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly media =
    typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;

  private readonly _preference = signal<ThemeChoice>(readPreference());
  private readonly systemPrefersDark = signal(this.media?.matches ?? false);

  /** The user's explicit choice (`'system'` follows the OS). */
  readonly preference = this._preference.asReadonly();

  /** Whether dark mode is currently active after resolving `'system'`. */
  readonly resolvedDark = computed(
    () =>
      this._preference() === 'dark' ||
      (this._preference() === 'system' && this.systemPrefersDark()),
  );

  constructor() {
    // Keep following the OS while the preference is `'system'`.
    this.media?.addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));

    effect(() => {
      const dark = this.resolvedDark();
      const el = document.documentElement;
      el.classList.toggle('app-dark', dark);
      el.style.colorScheme = dark ? 'dark' : 'light';
    });
  }

  setPreference(choice: ThemeChoice): void {
    this._preference.set(choice);
    writePreference(choice);
  }
}

function readPreference(): ThemeChoice {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
  } catch {
    /* storage unavailable (private mode) — fall through to default */
  }
  return 'system';
}

function writePreference(choice: ThemeChoice): void {
  try {
    localStorage.setItem(THEME_KEY, choice);
  } catch {
    /* storage unavailable — preference stays in memory for this session */
  }
}
