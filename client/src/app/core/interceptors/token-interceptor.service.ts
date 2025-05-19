import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor( private authService: AuthService) { }

  public intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (this.authService.isLoggedIn()){
      const tokenizedReq = req.clone({
      setHeaders: {
      
        Authorization: `Bearer ${this.authService.getToken()}`
      }
     });
      return next.handle(tokenizedReq);
    }
    return next.handle(req);
  }
}
