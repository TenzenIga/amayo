import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { Post } from '@shared/interfaces/interfaces';
import { DateAgoPipe } from '@shared/pipes/date-ago.pipe';
import {
  subscribeToSub,
  unsubscribeSub,
  getFeed,
  getPopular
} from 'app/store/actions/post.action';
import { clearSub } from 'app/store/actions/sub.action';
import {
  selectPosts,
  selectLoading,
  selectPagination
} from 'app/store/selectors/post.selector';
import { IAppState } from 'app/store/state/app.state';
import { IPagination } from 'app/store/state/post.state';
import { Observable } from 'rxjs';
import { PostComponent } from '../post/post.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';
import { TopSubsComponent } from '../top-subs/top-subs.component';

@Component({
  selector: 'app-popular-page',
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
  ],
  templateUrl: './popular-page.component.html',
  styleUrl: './popular-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopularPageComponent {
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

    this.store.dispatch(getPopular({ page: this.page }));
  }
}
