import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PostsService } from '@core/services/posts.service';
import { SubService } from '@core/services/sub.service';
import { postPayload, Sub } from '@shared/interfaces/interfaces';
import { from, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { quillConfiguration } from './quilConfig';


@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss'],
})
export class CreatePostFormComponent implements OnInit, OnDestroy {
  //context
  private subscription: Subscription;
  public subName?: string
  public postPayload: postPayload;
  public subs: Sub[];
  public quilConfig = quillConfiguration;
  public postForm = new FormGroup({
      sub: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required])
    });

    constructor(private postService: PostsService, private subService:SubService, private router: Router) { }

    public ngOnInit(): void {
      this.subscription =  this.postForm.get('sub').valueChanges.pipe(
        filter(text => text.length > 2 || text.length === 0),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap( text => text ? this.subService.searchSubs(text) : of([])),
      ).subscribe((res: Sub[]) => this.subs = res )
    }

    public createPost(): void {
      
      this.postPayload = this.postForm.value;
      
      this.postService.createPost(this.postPayload).subscribe(post => {
        this.router.navigate([`/r/${post.subName}/${post.identifier}/${post.title}`]);
      }, error => {
        console.log(error);
        // this.errors = error.error.errors;
      });
    }

    public setSub(name: string): void {
      this.postForm.get('sub').setValue(name, {emitEvent:false});
      this.subs = [];
    }

    public ngOnDestroy(): void {
      this.subscription.unsubscribe()
    }

}
