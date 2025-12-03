import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private url = '/api';

  public getUserInfo<T>(username: string): Observable<T> {
    return this.http.get<T>(`${this.url}/users/${username}`);
  }
  public getUserSubmissions<T>(
    username: string,
    type: 'post' | 'comment' | 'all'
  ): Observable<T> {
    const params = type ? new HttpParams().set('type', type) : null;
    return this.http.get<T>(`${this.url}/users/submissions/${username}`, {
      params
    });
  }
}
