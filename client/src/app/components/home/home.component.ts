import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { Store } from '@ngrx/store';
import { getPosts, subscribeToSub } from 'app/store/actions/post.action';

import { Post } from 'app/store/state/post.state';
import { IAppState } from 'app/store/state/app.state';
import { selectLoading, selectPosts, selectSubscribeToSubLoading } from 'app/store/selectors/post.selector';
import { AuthService } from '@core/services/auth.service';
import { clearSub } from 'app/store/actions/sub.action';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PostComponent } from '../post/post.component';
import { NgStyle } from '@angular/common';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopSubsComponent } from '../top-subs/top-subs.component';
import { CreateSubFormComponent } from '../create-sub-form/create-sub-form.component';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PushPipe } from '@ngrx/component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarLeftComponent } from "../sidebar-left/sidebar-left.component";
import { SidebarService } from '@core/services/sidebar.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FontAwesomeModule, LoaderComponent, PostComponent, RouterLink, NgStyle, SubscribeButtonComponent, SidebarComponent, TopSubsComponent, CreateSubFormComponent, DateAgoPipe, PushPipe, SidebarLeftComponent]
})
export class HomeComponent implements OnInit {
  protected readonly store:Store<IAppState> = inject(Store);
  protected readonly router: Router = inject(Router);
  protected readonly authService: AuthService = inject(AuthService);
  protected readonly sidebarService: SidebarService = inject(SidebarService);

  public readonly posts$: Observable<Post[]> = this.store.select(selectPosts);
  public readonly loading$: Observable<boolean> = this.store.select(selectLoading);
  public readonly subscribeToSubLoading$: Observable<boolean> = this.store.select(selectSubscribeToSubLoading);
  public faPen = faPen;
  
  ngOnInit(): void {
    this.store.dispatch(getPosts());
    this.store.dispatch(clearSub())
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

}


