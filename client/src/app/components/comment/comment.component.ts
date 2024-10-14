import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
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
  private authService = inject(AuthService);
  private router = inject(Router)
  
  public faCommentAlt = faCommentAlt;
  public faBookmark = faBookmark;
  public faThumbsUp = faThumbsUp;
  public faThumbsDown = faThumbsDown;

  @Input()
  post: Post;

  @Input()
  comment: Comment;

  @Output() vote = new EventEmitter<{ identifier: string; value: number }>();
  

  public onVote(value: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      if (value === this.comment.userVote) {
        value = 0;
      }
      this.vote.emit({ identifier: this.comment.identifier, value });
    }
  }
}
