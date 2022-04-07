import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PostsService } from '@core/services/posts.service';
import { SubService } from '@core/services/sub.service';
import { postPayload } from '@shared/interfaces';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss']
})
export class CreatePostFormComponent implements OnInit {
  @Input()
  public subName?: string
  public postPayload: postPayload;

  public postForm = new FormGroup({
      sub: new FormControl('', [Validators.required] ),
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required])
    });

    constructor(private postService: PostsService, private subService:SubService, router: Router) { }

    ngOnInit(): void {
      
      this.postPayload = {
        sub: this.subName ? this.subName : '',
        title: '',
        body: '',
      };

      this.postForm.get("sub").valueChanges.pipe(
        filter((x) => !!x),
        distinctUntilChanged()).subscribe(x => {
        this.subService.searchSubs(x).subscribe(res => console.log(res))
     })
    }

    public createPost(): void{
      this.postPayload.sub = this.postForm.get('sub').value;
      this.postPayload.title = this.postForm.get('title').value;
      this.postPayload.body = this.postForm.get('body').value;
      this.postService.createPost(this.postPayload).subscribe(data => {
        console.log(data);
        
        // this.router.navigate(['/login'],
        // { queryParams: { registered: 'true' } });
      }, error => {
        console.log(error);
        // this.errors = error.error.errors;
      });
    }
}
