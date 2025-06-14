import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CreateSubFormComponent } from '../create-sub-form/create-sub-form.component';
import { IAppState } from 'app/store/state/app.state';
import { Store } from '@ngrx/store';
import { getUserInfo } from 'app/store/actions/user.action';
import { Observable } from 'rxjs';
import { User } from 'app/store/state/user.state';
import { selectUserInfo } from 'app/store/selectors/user.selector';
import { PushPipe } from '@ngrx/component';
import { Sub } from '@shared/interfaces/interfaces';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faFire, faChartBar, faTable } from '@fortawesome/free-solid-svg-icons';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CreateSubFormComponent, PushPipe,FontAwesomeModule, NgStyle],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLeftComponent implements OnInit {
  protected readonly router: Router = inject(Router);
  private store: Store<IAppState> = inject(Store);
  private username = 'arhan2';
  public faHome = faHome;
  public faFire = faFire;
  public faChartBar = faChartBar;
  public faTable = faTable;
  public readonly userinfo$: Observable<User> = this.store.select(selectUserInfo);

  public ngOnInit(){
    this.store.dispatch(getUserInfo({username:this.username}))
  }

  public trackByFn(sub: Sub): number {
      return sub.id;
  }

  public goToSub(subname: string): void {
    this.router.navigate([`/r/${subname}`]);
  }
}
