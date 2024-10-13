import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubService } from '@core/services/sub.service';
import { subPayload } from '@shared/interfaces/interfaces';
import { AuthService } from '@core/services/auth.service';


@Component({
  selector: 'app-create-sub-form',
  templateUrl: './create-sub-form.component.html',
  styleUrls: ['./create-sub-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class CreateSubFormComponent implements OnInit {
  public error:string | null;
  public closeModal: string;
  public subPayload: subPayload;
  public remainingChars: number = 21;
  public subForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required] ),
  });
  
  constructor( private router: Router, private modalService: NgbModal, private subService:SubService, private authService:AuthService ) {}

  ngOnInit(): void {
    this.subForm.get('name').valueChanges.subscribe(v => {
        this.remainingChars = 21 - v.length;
    })
  }

  
 getRemainingChars(){
    return this.remainingChars;
 }
  public onBlur(){
    if(this.subForm.get('name').value.length){
      this.subPayload = {
        name: this.subForm.get('name').value
      }
      this.subService.validateSub(this.subPayload).subscribe(res => {
        this.error = res.fieldError;        
      })
    }
  }

  public createSub(): void {

    this.subPayload = {
      name: this.subForm.get('name').value
    }

  this.subService.createSub(this.subPayload).subscribe({
    next: () =>  {
      this.modalService.dismissAll(),
      this.router.navigate([`/r/${this.subForm.get('name').value}`])
    },
    error: (e) => console.error(e)
  }) 
  }


  public triggerModal<T>(content: TemplateRef<T>): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.modalService.open(content)
  }

  
  public get value(): string {
    return this.subForm.get('name').value
  }
  
}
