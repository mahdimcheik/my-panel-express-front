import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ServiceDetailsListResponse } from '../api/models';
import { ServicesStore } from './services-store';

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });
  const store = TestBed.inject(ServicesStore);
  const http = TestBed.inject(HttpTestingController);
  return { store, http };
}

describe('ServicesStore', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('unwraps the envelope, splits avantages, sorts by ordre and picks the best image', async () => {
    const { store, http } = setup();

    const body: ServiceDetailsListResponse = {
      message: 'ok',
      status: 200,
      data: [
        {
          id: 'b',
          nom: 'Second',
          description: null,
          avantages: 'a\n\n  b  \nc',
          ordre: 2,
          images: [
            { id: 'i2', objectKey: 'k2', ordre: 1, url: 'https://img/2' },
            { id: 'i1', objectKey: 'k1', ordre: 0, url: null },
          ],
        },
        { id: 'a', nom: 'First', description: 'desc', avantages: null, ordre: 1, images: null },
      ],
    };

    TestBed.tick(); // flush the resource loader effect
    http.expectOne('/services').flush(body);
    await Promise.resolve();

    const services = store.services();
    expect(services.map((s) => s.id)).toEqual(['a', 'b']);
    expect(store.usingFallback()).toBe(false);

    const second = services[1];
    expect(second.avantages).toEqual(['a', 'b', 'c']);
    // lowest-ordre image with an actual url wins (i2, since i1 has url:null)
    expect(second.image?.objectKey).toBe('k2');
    expect(second.image?.alt).toBe('صورة لخدمة Second');
  });

  it('falls back to static content on error', async () => {
    const { store, http } = setup();

    TestBed.tick();
    http.expectOne('/services').flush('boom', { status: 500, statusText: 'Server Error' });
    await Promise.resolve();

    expect(store.failed()).toBe(true);
    expect(store.usingFallback()).toBe(true);
    expect(store.services().length).toBeGreaterThan(0);
  });
});
