import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PostsService } from '@core/services/posts.service';
import {faCommentAlt, faBookmark} from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown, faThumbsUp} from '@fortawesome/free-solid-svg-icons';

import { Post, PostComment } from '@shared/interfaces';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  faCommentAlt = faCommentAlt;
  faBookmark = faBookmark;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;

  @Input()
  post: Post;

  @Input()
  comment: PostComment;

  constructor(private authService: AuthService, private router: Router, private postsService: PostsService ) { }

  ngOnInit(): void {
  }

  public vote(value: number): void{
    if (!this.authService.loggedIn()){
      this.router.navigate(['/login']);
    }else{
      if (value === this.comment.userVote){
        value = 0;
      }
      this.postsService.voteOnComment(this.comment.identifier, this.post.slug, value ).subscribe(res => this.comment = res);
  }
}
}
