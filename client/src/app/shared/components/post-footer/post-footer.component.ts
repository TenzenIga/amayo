import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { faCommentAlt, faBookmark } from '@fortawesome/free-regular-svg-icons';
import {
  faShare,
  faThumbsDown,
  faThumbsUp
} from '@fortawesome/free-solid-svg-icons';

import { Post } from '@shared/interfaces/interfaces';
import { AuthService } from '@core/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-post-footer',
    templateUrl: './post-footer.component.html',
    styleUrls: ['./post-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLink, FontAwesomeModule, NgClass]
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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      if (value === this.post.userVote) {
        value = 0;
      }
      this.vote.emit(value);
    }
  }
}
