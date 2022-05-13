import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PostsService } from '@core/services/posts.service';
import { Store } from '@ngrx/store';
import { getPosts, PostActions } from 'app/store/actions/post.action';
import { IPostState, Post } from 'app/store/state/post.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public posts$: Observable<Post[]> = this.store.select( state => state.posts.posts);

  constructor(private store: Store<{posts: IPostState}> ) { 
  }

  ngOnInit(): void {
    this.store.dispatch(getPosts());
  }

  public trackByFn(index: string, post: Post): string {
    return post.identifier;
  }
}
