import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubService } from '@core/services/sub.service';
import { subPayload } from '@shared/interfaces';


@Component({
  selector: 'app-create-sub-form',
  templateUrl: './create-sub-form.component.html',
  styleUrls: ['./create-sub-form.component.scss']
})
export class CreateSubFormComponent implements OnInit {
  public subPayload: subPayload;
  public subForm = new FormGroup({
     name: new FormControl('', [Validators.required] ),
     title: new FormControl('', [Validators.required]),
     description: new FormControl('', [Validators.required])
   });
 
  constructor(private subService:SubService, private router: Router) {
    this.subPayload = {
      name: "",
      title: "",
      description:"",
    };
  }

  ngOnInit(): void {
  }

  public createSub(): void {
    this.subPayload.name = this.subForm.get('name').value;
    this.subPayload.title = this.subForm.get('title').value;
    this.subPayload.description = this.subForm.get('description').value;
    this.subService.createSub(this.subPayload).subscribe(data => {
      console.log(data);
      
      // this.router.navigate(['/login'],
      // { queryParams: { registered: 'true' } });
    }, error => {
      console.log(error);
      // this.errors = error.error.errors;
    });
  }
}
