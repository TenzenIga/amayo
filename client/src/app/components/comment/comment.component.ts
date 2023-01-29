import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { faCommentAlt, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Post, Comment } from '@shared/interfaces/interfaces';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  faCommentAlt = faCommentAlt;
  faBookmark = faBookmark;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;

  @Input()
  post: Post;

  @Input()
  comment: Comment;

  @Output() vote = new EventEmitter<{ identifier: string; value: number }>();

  constructor(private authService: AuthService, private router: Router) {}

  public onVote(value: number): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/login']);
    } else {
      if (value === this.comment.userVote) {
        value = 0;
      }
      this.vote.emit({ identifier: this.comment.identifier, value });
    }
  }
}
