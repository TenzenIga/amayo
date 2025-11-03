import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { Store } from '@ngrx/store';
import {
  getPosts,
  subscribeToSub,
  unsubscribeSub
} from 'app/store/actions/post.action';

import { IPagination, Post } from 'app/store/state/post.state';
import { IAppState } from 'app/store/state/app.state';
import {
  selectLoading,
  selectPagination,
  selectPosts
} from 'app/store/selectors/post.selector';
import { AuthService } from '@core/services/auth.service';
import { clearSub } from 'app/store/actions/sub.action';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PostComponent } from '../post/post.component';
import { NgStyle } from '@angular/common';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopSubsComponent } from '../top-subs/top-subs.component';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PushPipe } from '@ngrx/component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FontAwesomeModule,
    LoaderComponent,
    PostComponent,
    RouterLink,
    NgStyle,
    SubscribeButtonComponent,
    SidebarComponent,
    TopSubsComponent,
    DateAgoPipe,
    PushPipe
  ]
})
export class HomeComponent implements OnInit {
  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer!: IntersectionObserver;
  private page = 0;
  private isLoading = false;
  private hasNext = true;
  private destroyRef = inject(DestroyRef);
  private readonly store: Store<IAppState> = inject(Store);
  private readonly authService: AuthService = inject(AuthService);
  public readonly posts$: Observable<Post[]> = this.store.select(selectPosts);
  public readonly loading$: Observable<boolean> =
    this.store.select(selectLoading);
  public readonly pagination$: Observable<IPagination> =
    this.store.select(selectPagination);
  public faPen = faPen;
  ngOnInit(): void {
    this.store.dispatch(clearSub());
    this.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => {
        this.isLoading = loading;
      });
    this.pagination$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((p) => {
        if (Object.keys(p).length > 0) {
          this.page = p.currentPage;
          this.hasNext = p.hasNext;
        }
      });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }
  public trackByFn(index: string, post: Post): string {
    return post.identifier;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public subscribeToSub(subName: string) {
    this.store.dispatch(subscribeToSub({ name: subName }));
  }

  public unsubscribeSub(subName: string) {
    this.store.dispatch(unsubscribeSub({ name: subName }));
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && this.hasNext) {
          this.loadMorePosts();
        }
      });
    }, options);

    this.observer.observe(this.sentinel.nativeElement);
  }

  private loadMorePosts(): void {
    if (this.isLoading) {
      return;
    }
    this.page++;

    this.store.dispatch(getPosts({ page: this.page }));
  }
}
