import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { getPosts } from 'app/store/actions/post.action';
import { Post } from 'app/store/state/post.state';
import { IAppState } from 'app/store/state/app.state';
import { selectLoading, selectPosts } from 'app/store/selectors/post.selector';
import { Status } from 'app/store/models/status';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  public readonly posts$: Observable<Post[]> = this.store.select(selectPosts);
  public readonly loading$: Observable<boolean> =
    this.store.select(selectLoading);
  constructor(private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.store.dispatch(getPosts());
  }

  public trackByFn(index: string, post: Post): string {
    return post.identifier;
  }
}
