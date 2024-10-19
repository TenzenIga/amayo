import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  faBirthdayCake,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

import { Sub } from '@shared/interfaces/interfaces';
import { IAppState } from 'app/store/state/app.state';
import { Store } from '@ngrx/store';
import { selectSub } from 'app/store/selectors/sub.selector';

@Component({
  selector: 'app-sub-info',
  templateUrl: './sub-info.component.html',
  styleUrls: ['./sub-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubInfoComponent {
  private store: Store<IAppState> = inject(Store);
  private router: Router = inject(Router);
  public faBirthdayCake = faBirthdayCake;
  public faCalendarAlt = faCalendarAlt;
  public subName: string;

  public readonly sub$: Observable<Sub> = this.store.select(selectSub);

  public goToCreatePostPage(): void {
    this.router.navigate([`r/${this.subName}/submit`]);
  }
}
