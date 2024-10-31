import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { getPosts, subscribeToSub } from 'app/store/actions/post.action';
import { Post } from 'app/store/state/post.state';
import { IAppState } from 'app/store/state/app.state';
import { selectLoading, selectPosts, selectSubscribeToSubLoading } from 'app/store/selectors/post.selector';
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
  public readonly subscribeToSubLoading$: Observable<boolean> = this.store.select(selectSubscribeToSubLoading);

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

  public subscribeToSub(subName: string) {
    this.store.dispatch(subscribeToSub({name: subName }));
  }

  public unsubscribeSub(subName: string){
    
  } 
}
