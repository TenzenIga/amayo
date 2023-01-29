import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Post } from '@shared/interfaces/interfaces';
import { votePost } from 'app/store/actions/post.action';
import { IAppState } from 'app/store/state/app.state';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
  @Input() post: Post;
  constructor(private store: Store<IAppState>) {}
  public onVotePost(value: number) {
    const { identifier, slug } = this.post;
    this.store.dispatch(votePost({ identifier, slug, value }));
  }
}
