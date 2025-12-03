import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, NgStyle } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { User } from 'app/store/state/user.state';
import { SubmissionComponent } from './submission/submission.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
  imports: [
    SidebarComponent,
    AsyncPipe,
    SubmissionComponent,
    UserInfoComponent,
    LoaderComponent,
    UserProfileComponent
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserpageComponent implements OnInit {
  private userService = inject(UserService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public userName: string;
  public userinfo$: Observable<User>;
  public submissions$;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.userName = routeParams['username'];
      this.userinfo$ = this.userService.getUserInfo(this.userName);
      this.submissions$ = this.userService.getUserSubmissions(
        this.userName,
        'all'
      );
    });
  }

  public filterSubmissions(type: 'comment' | 'post'): void {
    this.submissions$ = this.userService.getUserSubmissions(
      this.userName,
      'comment'
    );
  }
  handleFilterChange(name: 'post' | 'comment' | 'all') {
    this.submissions$ = this.userService.getUserSubmissions(
      this.userName,
      name
    );
  }
}
