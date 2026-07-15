import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ImageRef } from '../../../core/data/view-models';
import { RemoteImage } from './remote-image';

@Component({
  imports: [RemoteImage],
  template: `<app-remote-image [image]="image()" />`,
})
class Host {
  readonly image = signal<ImageRef>({ url: 'https://img/expired', objectKey: 'key-1', alt: 'x' });
}

describe('RemoteImage', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    return { fixture, http };
  }

  function img(fixture: ReturnType<typeof setup>['fixture']): HTMLImageElement {
    return fixture.nativeElement.querySelector('img') as HTMLImageElement;
  }

  it('re-signs the url once on the first error', async () => {
    const { fixture, http } = setup();

    img(fixture).dispatchEvent(new Event('error'));
    await Promise.resolve();

    const req = http.expectOne((r) => r.url === '/media/url');
    expect(req.request.params.get('key')).toBe('key-1');
    req.flush({ message: 'ok', status: 200, data: { key: 'key-1', url: 'https://img/fresh' } });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(img(fixture).getAttribute('src')).toBe('https://img/fresh');
  });

  it('shows the placeholder on a second error without another request', async () => {
    const { fixture, http } = setup();

    img(fixture).dispatchEvent(new Event('error'));
    await Promise.resolve();
    http
      .expectOne((r) => r.url === '/media/url')
      .flush({ message: 'ok', status: 200, data: { key: 'key-1', url: 'https://img/fresh' } });
    await fixture.whenStable();
    fixture.detectChanges();

    img(fixture).dispatchEvent(new Event('error'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    http.expectNone((r) => r.url === '/media/url');
  });
});
