import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { loginPayload } from '@shared/interfaces/interfaces';

type errors = {
  username: null | string
  password: null | string
};

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, RouterLinkActive]
})
export class LoginComponent implements OnInit {
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
    this.loginData = {
      username: '',
      password: ''
    };
   }

  ngOnInit(): void {
  }

  public logIn(): void {
    this.loginData.username = this.loginForm.get('login').value;
    this.loginData.password = this.loginForm.get('password').value;

    this.authService.login(this.loginData).subscribe(res => {
      localStorage.setItem('token', res.token);
      this.router.navigate(['/']);
    }, error => {
      this.errors = {...error.error};
    });
  }
}
