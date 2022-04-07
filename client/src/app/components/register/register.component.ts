import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { AuthService } from '@core/services/auth.service';
import { signupPayload } from '@shared/interfaces';

type errors = {
  email: null | string,
  username: null | string
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
 public errors: errors = {
   email: null,
   username: null
 };

 public signupData: signupPayload;
 public registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email] ),
    login: new FormControl('', [Validators.required, Validators.minLength(3) ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) {
    this.signupData = {
      username: '',
      email: '',
      password: '',
    };
   }

  ngOnInit(): void {
  }

  public signUp(): void{
    this.signupData.email = this.registerForm.get('email').value;
    this.signupData.username = this.registerForm.get('login').value;
    this.signupData.password = this.registerForm.get('password').value;
    this.authService.signUp(this.signupData).subscribe(data => {
      this.router.navigate(['/login'],
      { queryParams: { registered: 'true' } });
    }, error => {
      console.log(error);
      this.errors = error.error.errors;
    });
  }
}
