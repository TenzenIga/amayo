import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PostsService } from '@core/services/posts.service';
import { Post, PostComment } from '@shared/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
 

  public post$: Observable<Post>;
  public comments$: Observable<PostComment[]>;

  constructor(private activatedRoute: ActivatedRoute, private postService: PostsService) {
   }

  ngOnInit(): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('identifier');
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.post$ = this.postService.getPost(identifier, slug);
    this.comments$ = this.postService.getPostCommets(identifier, slug);
  }

  public sendComment(commentBody: string): void{
    const identifier = this.activatedRoute.snapshot.paramMap.get('identifier');
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');

    this.postService.sendComment(identifier, slug, commentBody).subscribe(data => {
      this.post$ = this.postService.getPost(identifier, slug);
      this.comments$ = this.postService.getPostCommets(identifier, slug);
    }, error => {
      console.log(error);
    });
  }

  public trackByFn(index: string, comment: PostComment): string {
    return comment.identifier;
  }
}