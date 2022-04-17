import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PostsService } from '@core/services/posts.service';
import { SubService } from '@core/services/sub.service';
import { postPayload, Sub } from '@shared/interfaces/interfaces';
import { Observable } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { quillConfiguration } from './quilConfig';


@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss']
})
export class CreatePostFormComponent implements OnInit {
  //context
  public subName?: string
  public postPayload: postPayload;
  public subs$: Observable<Sub[]>;
  public quilConfig = quillConfiguration;
  public postForm = new FormGroup({
      sub: new FormControl('', [Validators.required] ),
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required])
    });

    constructor(private postService: PostsService, private subService:SubService, router: Router) { }

    ngOnInit(): void {
      this.postForm.get('sub').valueChanges.pipe(
        filter(text => text.length > 2),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap( text => this.subService.searchSubs(text))
      )
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
