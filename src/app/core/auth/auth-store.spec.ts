import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { LoginResponseResponse } from '../api/models';
import { AuthStore } from './auth-store';

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });
  const store = TestBed.inject(AuthStore);
  const http = TestBed.inject(HttpTestingController);
  return { store, http };
}

describe('AuthStore', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.clear();
  });

  it('starts unauthenticated with no stored token', () => {
    const { store } = setup();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.currentUser()).toBeNull();
  });

  it('persists the token and flips isAuthenticated on login', async () => {
    const { store, http } = setup();

    const body: LoginResponseResponse = {
      message: 'ok',
      status: 200,
      data: {
        token: 'jwt-123',
        expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
        user: { id: 'u1', email: 'admin@example.com', firstName: 'Ada', lastName: 'Lovelace' },
      },
    };

    let done = false;
    store.login({ email: 'admin@example.com', password: 'secret' }).subscribe(() => (done = true));

    const req = http.expectOne('/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(body);
    await Promise.resolve();

    expect(done).toBe(true);
    expect(store.isAuthenticated()).toBe(true);
    expect(store.currentToken()).toBe('jwt-123');
    expect(store.currentUser()?.nomComplet).toBe('Ada Lovelace');
    expect(localStorage.getItem('mpe.auth.token')).toBe('jwt-123');
  });

  it('treats an expired token as unauthenticated', () => {
    localStorage.setItem('mpe.auth.token', 'stale');
    localStorage.setItem('mpe.auth.expiresAt', new Date(Date.now() - 1000).toISOString());
    const { store } = setup();
    expect(store.isAuthenticated()).toBe(false);
  });
});
