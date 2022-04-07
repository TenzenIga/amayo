import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

import { signupPayload, loginPayload } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = null;
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  public signUp(signupData: signupPayload): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/register', signupData, this.httpOptions);

  }

  public login(loginData: loginPayload): Observable<any> {
    return this.http.post('http://localhost:5000/api/auth/login', loginData, this.httpOptions)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('token', token);
            this.setToken(token);
          }
        )
      );

  }

  public loggedIn(): boolean {
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
