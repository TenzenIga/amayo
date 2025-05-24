import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { PostsService } from '@core/services/posts.service';
import { Post, Comment } from '@shared/interfaces/interfaces';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/state/app.state';
import { selectPost } from 'app/store/selectors/post.selector';
import { getPost, votePost } from 'app/store/actions/post.action';
import { getComments, voteComment } from 'app/store/actions/comment.action';
import { selectComments } from 'app/store/selectors/comment.selector';
import { getSub } from 'app/store/actions/sub.action';
import { NgStyle } from '@angular/common';
import { PostFooterComponent } from '../../shared/components/post-footer/post-footer.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentComponent } from '../comment/comment.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SubInfoComponent } from '../sub-info/sub-info.component';
import { TopSubsComponent } from '../top-subs/top-subs.component';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PushPipe } from '@ngrx/component';

@Component({
    selector: 'app-post-page',
    templateUrl: './post-page.component.html',
    styleUrls: ['./post-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgStyle, RouterLink, PostFooterComponent, CommentFormComponent, CommentComponent, LoaderComponent, SidebarComponent, SubInfoComponent, TopSubsComponent, DateAgoPipe, PushPipe]
})
export class PostPageComponent implements OnInit {
  public identifier: string;
  public subName: string;
  public slug: string;
  public post$: Observable<Post> = this.store.select(selectPost);
  public comments$: Observable<Comment[]> = this.store.select(selectComments);

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private store: Store<IAppState>,
    private router: Router = inject(Router)
    
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.identifier = params.get('identifier');
      this.slug = params.get('slug');
      this.subName = params.get('subName');
      this.store.dispatch(
        getPost({ identifier: this.identifier, slug: this.slug })
      );
      this.store.dispatch(
        getComments({ identifier: this.identifier, slug: this.slug })
      );
      this.store.dispatch(
        getSub({ subName:  this.subName })
      );
    });
  }

  public sendComment(commentBody: string): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('identifier');
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.postService.sendComment(identifier, slug, commentBody).subscribe(
      {
        next:   (data) => this.post$ = this.postService.getPost(identifier, slug),
        error:(error) => console.log(error)
      }
  
    );
  }

  public trackByFn(comment: Comment): string {
    return comment.identifier;
  }

  public onVotePost(value: number) {
    this.store.dispatch(
      votePost({ identifier: this.identifier, slug: this.slug, value })
    );
  }

  public onVoteComment(event: { identifier: string; value: number }) {
    const { identifier, value } = event;
    this.store.dispatch(voteComment({ identifier, slug: this.slug, value }));
  }

  public goToSub(){
    const subName = this.activatedRoute.snapshot.paramMap.get('subName');
    this.router.navigate([`/r/${subName}`])
  }
}
