import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { faCommentAlt, faBookmark } from '@fortawesome/free-regular-svg-icons';
import {
  faShare,
  faThumbsDown,
  faThumbsUp
} from '@fortawesome/free-solid-svg-icons';

import { PostsService } from '@core/services/posts.service';
import { Post } from '@shared/interfaces/interfaces';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-post-footer',
  templateUrl: './post-footer.component.html',
  styleUrls: ['./post-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFooterComponent {
  faCommentAlt = faCommentAlt;
  faBookmark = faBookmark;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShare = faShare;

  @Input()
  post: Post;

  @Output() vote = new EventEmitter<number>();

  constructor(private router: Router, private authService: AuthService) {}

  public onVote(value: number): void {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/login']);
    } else {
      if (value === this.post.userVote) {
        value = 0;
      }
      this.vote.emit(value);
    }
  }
}
