import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { getPosts } from 'app/store/actions/post.action';
import { Post } from 'app/store/state/post.state';
import { IAppState } from 'app/store/state/app.state';
import { selectLoading, selectPosts } from 'app/store/selectors/post.selector';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  protected readonly store:Store<IAppState> = inject(Store);
  protected readonly router: Router = inject(Router);
  protected readonly authService: AuthService = inject(AuthService);
  public readonly posts$: Observable<Post[]> = this.store.select(selectPosts);
  public readonly loading$: Observable<boolean> = this.store.select(selectLoading);

  ngOnInit(): void {
    this.store.dispatch(getPosts());
  }

  public trackByFn(index: string, post: Post): string {
    return post.identifier;
  }

  public goToCreatePostPage(): void {
    this.router.navigate(['/submit']);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
