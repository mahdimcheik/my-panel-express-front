import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../api/endpoints/auth/auth.service';
import type { UserLogin } from '../api/models';
import { toUserView } from '../data/mappers';
import type { UserView } from '../data/view-models';

const TOKEN_KEY = 'mpe.auth.token';
const EXPIRES_KEY = 'mpe.auth.expiresAt';
const USER_KEY = 'mpe.auth.user';

/**
 * Holds the authenticated administrator session. Imperative (login is a user
 * action, not a reactive fetch), but exposes signals like the `core/data` stores.
 * The token is persisted to `localStorage` and rehydrated synchronously in the
 * constructor so the route guard is correct immediately after a page refresh.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(AuthService);
  private readonly router = inject(Router);

  private readonly token = signal<string | null>(readStorage(TOKEN_KEY));
  private readonly expiresAt = signal<string | null>(readStorage(EXPIRES_KEY));
  private readonly user = signal<UserView | null>(readUser());

  readonly currentUser = computed(() => this.user());

  readonly isAuthenticated = computed(() => {
    const token = this.token();
    if (!token) {
      return false;
    }
    const expiresAt = this.expiresAt();
    return !expiresAt || Date.parse(expiresAt) > Date.now();
  });

  /** Reads the current bearer token; `null` when logged out. */
  currentToken(): string | null {
    return this.token();
  }

  login(credentials: UserLogin): Observable<void> {
    return this.api.postAuthLogin(credentials).pipe(
      map((response) => {
        const data = response.data;
        if (!data?.token) {
          throw new Error('Réponse de connexion invalide');
        }
        const user = data.user ? toUserView(data.user) : null;
        this.persist(data.token, data.expiresAt ?? null, user);
      }),
    );
  }

  /** Refreshes the cached user from `/auth/me`; best-effort, ignores failures. */
  refreshUser(): void {
    this.api.getAuthMe().subscribe({
      next: (response) => {
        if (response.data) {
          const user = toUserView(response.data);
          this.user.set(user);
          writeStorage(USER_KEY, JSON.stringify(user));
        }
      },
      error: () => {
        /* leave the cached user in place */
      },
    });
  }

  logout(): void {
    this.persist(null, null, null);
    void this.router.navigate(['/login']);
  }

  private persist(token: string | null, expiresAt: string | null, user: UserView | null): void {
    this.token.set(token);
    this.expiresAt.set(expiresAt);
    this.user.set(user);

    if (token) {
      writeStorage(TOKEN_KEY, token);
      writeStorage(EXPIRES_KEY, expiresAt ?? '');
      writeStorage(USER_KEY, user ? JSON.stringify(user) : '');
    } else {
      removeStorage(TOKEN_KEY);
      removeStorage(EXPIRES_KEY);
      removeStorage(USER_KEY);
    }
  }
}

function readStorage(key: string): string | null {
  try {
    const value = localStorage.getItem(key);
    return value && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode / SSR) — session stays in memory */
  }
}

function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function readUser(): UserView | null {
  const raw = readStorage(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as UserView;
  } catch {
    return null;
  }
}
