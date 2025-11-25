import { NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Post } from 'app/store/state/post.state';
import { Comment } from '@shared/interfaces/interfaces';
import { faCommentAlt, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PostComponent } from 'app/components/post/post.component';
import { DateAgoPipe } from '@shared/pipes/date-ago.pipe';

@Component({
  selector: 'app-submission',
  standalone: true,
  imports: [
    RouterLink,
    NgStyle,
    NgClass,
    FontAwesomeModule,
    PostComponent,
    DateAgoPipe
  ],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmissionComponent {
  @Input() submissions: Array<Post | Comment>;
  private router: Router = inject(Router);
  public activeIndex = 1;

  public faCommentAlt = faCommentAlt;
  public faBookmark = faBookmark;
  public faThumbsUp = faThumbsUp;
  public faThumbsDown = faThumbsDown;

  public goToPost(submission) {
    if (submission.type === 'Post') {
      this.router.navigate([submission.url]);
    } else {
      this.router.navigate([submission.post.url]);
    }
  }
  public trackByFn(index: number, post: Post | Comment): string | number {
    return post.identifier || index;
  }
  public onClick(index: number) {
    this.activeIndex = index;
  }
}
