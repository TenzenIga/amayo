import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private authservice: AuthService, private router: Router){}

  canActivate(): Observable<boolean> {
    if(this.authservice.isLoggedIn()){
      return of(true);
    } else {
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
