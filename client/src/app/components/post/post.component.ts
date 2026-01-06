import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Post } from '@shared/interfaces/interfaces';
import { votePost } from 'app/store/actions/post.action';
import { IAppState } from 'app/store/state/app.state';
import { RouterLink } from '@angular/router';
import { PostFooterComponent } from '../../shared/components/post-footer/post-footer.component';
import { TruncateHtmlPipe } from '@shared/pipes/truncate-html.pipe';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, PostFooterComponent, TruncateHtmlPipe]
})
export class PostComponent {
  @Input() post: Post;

  private store: Store<IAppState> = inject(Store);

  public onVotePost(value: number) {
    const { identifier, slug } = this.post;
    this.store.dispatch(votePost({ identifier, slug, value }));
  }
}
