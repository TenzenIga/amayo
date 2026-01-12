import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  Output
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { faCommentAlt, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Post, Comment } from '@shared/interfaces/interfaces';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { voteComment } from 'app/store/actions/comment.action';
import { Store } from '@ngrx/store';
import { ReplyFormComponent } from './reply-form/reply-form.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    NgClass,
    DateAgoPipe,
    ReplyFormComponent
  ]
})
export class CommentComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);
  public faCommentAlt = faCommentAlt;
  public faBookmark = faBookmark;
  public faThumbsUp = faThumbsUp;
  public faThumbsDown = faThumbsDown;
  public toggleReplyFormStatus = false;

  @Input()
  post: Post;

  @Input()
  comment: Comment;

  public onVoteComment(value: number) {
    const { identifier } = this.comment;
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      if (value === this.comment.userVote) {
        value = 0;
      }
      console.log(identifier, value);

      this.store.dispatch(voteComment({ identifier, value }));
    }
  }

  public trackByFn(comment: Comment): number {
    return comment.id;
  }

  public onToggleReplyForm(value: boolean) {
    this.toggleReplyFormStatus = value;
  }
}
