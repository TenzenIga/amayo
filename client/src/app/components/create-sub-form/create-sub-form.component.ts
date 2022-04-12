import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubService } from '@core/services/sub.service';
import { subPayload } from '@shared/interfaces/interfaces';


@Component({
  selector: 'app-create-sub-form',
  templateUrl: './create-sub-form.component.html',
  styleUrls: ['./create-sub-form.component.scss']
})
export class CreateSubFormComponent implements OnInit {
  public subPayload: subPayload;
  public subForm = new FormGroup({
     name: new FormControl('', [Validators.required] ),
   });
 
  constructor(private subService:SubService, private router: Router) {
    this.subPayload = {
      name: "",
    };
  }

  ngOnInit(): void {
  }

  public createSub(): void {
    this.subPayload.name = this.subForm.get('name').value;
    this.subService.createSub(this.subPayload).subscribe(data => {
      
      this.router.navigate(['/'])
    }, error => {
      console.log(error);
      // this.errors = error.error.errors;
    });
  }
}
