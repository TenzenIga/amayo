import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

import { PostsService } from '@core/services/posts.service';
import { Post, Comment } from '@shared/interfaces/interfaces';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/state/app.state';
import { selectPost } from 'app/store/selectors/post.selector';
import { getPost, votePost } from 'app/store/actions/post.action';
import { getComments } from 'app/store/actions/comment.action';
import { selectComments } from 'app/store/selectors/comment.selector';



@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostPageComponent implements OnInit {

  public identifier: string;
  public slug: string;
  public post$: Observable<Post> = this.store.select(selectPost);
  public comments$: Observable<Comment[]> = this.store.select(selectComments);

  constructor(private activatedRoute: ActivatedRoute, private postService: PostsService, private store: Store<IAppState>) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.identifier = params.get('identifier');
      this.slug = params.get('slug');
      this.store.dispatch(getPost({ identifier: this.identifier, slug: this.slug }));
      this.store.dispatch(getComments({ identifier: this.identifier, slug: this.slug }));

    })

  }

  public sendComment(commentBody: string): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('identifier');
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');

    this.postService.sendComment(identifier, slug, commentBody).subscribe(data => {
      this.post$ = this.postService.getPost(identifier, slug);
    }, error => {
      console.log(error);
    });
  }

  public trackByFn(comment: Comment): string {
    return comment.identifier;
  }

  public onVotePost(value: number) {
    const identifier = this.activatedRoute.snapshot.paramMap.get('identifier');
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.store.dispatch(votePost({ identifier, slug, value }));
  }
}
