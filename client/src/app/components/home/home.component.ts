import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PostsService } from '@core/services/posts.service';
import { Post } from '@shared/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts$: Observable<Post[]>;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.posts$ = this.postsService.getPosts();
  }

  public trackByFn(index: string, post: Post): string {
    return post.identifier;
  }
}
