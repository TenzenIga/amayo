import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { loginPayload } from '@shared/interfaces/interfaces';
import { switchMap } from 'rxjs';

type errors = {
  username: null | string;
  password: null | string;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive]
})
export class LoginComponent {
  public errors: errors = {
    username: null,
    password: null
  };

  public loginData: loginPayload;
  public loginForm = new UntypedFormGroup({
    login: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.loginData = {
      username: '',
      password: ''
    };
  }

  public logIn(): void {
    this.loginData.username = this.loginForm.get('login').value;
    this.loginData.password = this.loginForm.get('password').value;

    this.authService
      .login(this.loginData)
      .pipe(
        switchMap((res) => {
          localStorage.setItem('token', res.token);
          return this.authService.me();
        })
      )
      .subscribe((userInfo) => {
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('userImageUrl', userInfo.userImageUrl);
        this.router.navigate(['/']);
      });
  }
}
