import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


import { AuthService } from '@core/services/auth.service';
import { signupPayload } from '@shared/interfaces/interfaces';

type errors = {
  email: null | string,
  username: null | string
};

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, RouterLinkActive]
})
export class RegisterComponent implements OnInit {
 public errors: errors = {
   email: null,
   username: null
 };

 public signupData: signupPayload;
 public registerForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email] ),
    login: new UntypedFormControl('', [Validators.required, Validators.minLength(3) ]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
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
