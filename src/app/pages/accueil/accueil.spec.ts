import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { providePrimeNG } from 'primeng/config';
import { Accueil } from './accueil';

describe('Accueil', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        providePrimeNG(),
      ],
    });
    const fixture = TestBed.createComponent(Accueil);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    return { fixture, http };
  }

  it('renders exactly one h1', () => {
    const { fixture, http } = setup();
    http.expectOne('/services').flush({ message: 'ok', status: 200, data: [] });
    http.expectOne((r) => r.url === '/realisations/recentes').flush({
      message: 'ok',
      status: 200,
      data: [],
    });

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('h1').length).toBe(1);
  });

  it('hides the realisations section when the API returns none', async () => {
    const { fixture, http } = setup();
    http.expectOne('/services').flush({ message: 'ok', status: 200, data: [] });
    http.expectOne((r) => r.url === '/realisations/recentes').flush({
      message: 'ok',
      status: 200,
      data: [],
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const headings = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('h2'),
    ).map((h) => h.textContent?.trim());
    expect(headings).not.toContain('أحدث أعمالنا');
  });
});
