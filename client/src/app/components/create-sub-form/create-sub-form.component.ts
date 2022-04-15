import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubService } from '@core/services/sub.service';
import { subPayload } from '@shared/interfaces/interfaces';


@Component({
  selector: 'app-create-sub-form',
  templateUrl: './create-sub-form.component.html',
  styleUrls: ['./create-sub-form.component.scss']
})
export class CreateSubFormComponent implements OnInit {
  public error:string | null;
  public closeModal: string;
  public subPayload: subPayload;
  public remainingChars: number = 21;
  public subForm = new FormGroup({
    name: new FormControl('', [Validators.required] ),
  });
  
  constructor( private router: Router, private modalService: NgbModal, private subService:SubService ) {}

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
    this.subService.createSub(this.subPayload).subscribe(data => {      
      this.modalService.dismissAll();
    }, error => {
      console.log(error);
      // this.errors = error.error.errors;
    });
  }


  public triggerModal(content): void {
    this.modalService.open(content)
  }

  
  public get value() : string {
    return this.subForm.get('name').value
  }
  
}
