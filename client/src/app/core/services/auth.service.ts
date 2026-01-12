import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

import { signupPayload, loginPayload } from '@shared/interfaces/interfaces';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/state/app.state';
import { clearUserData } from 'app/store/actions/user.action';
import { getPosts, resetPosts } from 'app/store/actions/post.action';

/**
 * TO DO
 * Переписать используя observable и верификацию для токена
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = null;
  private store: Store<IAppState> = inject(Store);
  private http: HttpClient = inject(HttpClient);

  public signUp(signupData: signupPayload): Observable<any> {
    return this.http.post('/api/auth/register', signupData);
  }

  public login(loginData: loginPayload): Observable<any> {
    return this.http.post('/api/auth/login', loginData).pipe(
      tap(({ token }) => {
        localStorage.setItem('token', token);
        this.setToken(token);
      })
    );
  }

  public me(): Observable<any> {
    return this.http.get('/api/auth/me');
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImageUrl');
    this.store.dispatch(clearUserData());
    this.store.dispatch(resetPosts());
    this.store.dispatch(getPosts({ page: 0 }));
  }
}
