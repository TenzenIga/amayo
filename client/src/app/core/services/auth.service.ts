import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

import { signupPayload, loginPayload } from '@shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = null;
  constructor(private http: HttpClient) { }

  public signUp(signupData: signupPayload): Observable<any> {
    return this.http.post('/api/auth/register', signupData, );

  }

  public login(loginData: loginPayload): Observable<any> {
    return this.http.post('/api/auth/login', loginData, )
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('token', token);
            this.setToken(token);
          }
        )
      );

  }

  public me():Observable<any> {
    return this.http.get('/api/auth/me')

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
  }
}
