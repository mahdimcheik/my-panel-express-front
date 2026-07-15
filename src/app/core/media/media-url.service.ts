import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { MediaService } from '../api/endpoints/media/media.service';

/** Re-signs an expired MinIO presigned URL from its stable object key. */
@Injectable({ providedIn: 'root' })
export class MediaUrlService {
  private readonly api = inject(MediaService);

  /** Emits a fresh presigned URL for `key`; completes without emitting on failure. */
  refresh(key: string): Observable<string> {
    return this.api.getMediaUrl({ key }).pipe(
      map((res) => res.data?.url ?? ''),
      map((url) => {
        if (!url) {
          throw new Error('empty url');
        }
        return url;
      }),
      catchError(() => EMPTY),
    );
  }
}
