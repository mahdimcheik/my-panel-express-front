import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { providePrimeNG } from 'primeng/config';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
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
    const fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
    return fixture;
  }

  function burger(fixture: ReturnType<typeof setup>): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[aria-controls="mobile-menu"]');
  }

  it('toggles aria-expanded when the burger is clicked', () => {
    const fixture = setup();
    expect(burger(fixture).getAttribute('aria-expanded')).toBe('false');

    burger(fixture).click();
    fixture.detectChanges();

    expect(burger(fixture).getAttribute('aria-expanded')).toBe('true');
  });
});
