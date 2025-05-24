import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLink, FontAwesomeModule, NgClass, DateAgoPipe]
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
