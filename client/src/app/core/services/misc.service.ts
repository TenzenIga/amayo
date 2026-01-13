import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiscService {
  private url = '/api/misc';
  private http: HttpClient = inject(HttpClient);

  public voteOnPost<T>(
    identifier: string,
    slug: string,
    value: number
  ): Observable<T> {
    return this.http.post<T>(`${this.url}/vote-post`, {
      identifier,
      slug,
      value
    });
  }

  public voteOnComment<T>(identifier: string, value: number): Observable<T> {
    return this.http.post<T>(`${this.url}/vote-comment`, {
      identifier,
      value
    });
  }
}
