import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  faBirthdayCake,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

import { Sub } from '@shared/interfaces/interfaces';
import { IAppState } from 'app/store/state/app.state';
import { Store } from '@ngrx/store';
import { selectSub } from 'app/store/selectors/sub.selector';
import { getSub } from 'app/store/actions/sub.action';

@Component({
  selector: 'app-sub-info',
  templateUrl: './sub-info.component.html',
  styleUrls: ['./sub-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubInfoComponent implements OnInit {
  public faBirthdayCake = faBirthdayCake;
  public faCalendarAlt = faCalendarAlt;
  public subName: string;

  public readonly sub$: Observable<Sub>;
  constructor(
    private store: Store<IAppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((routeParams) => {
      if (routeParams['subName'] === undefined) return false;
      this.subName = routeParams['subName'];
    });
    this.sub$ = this.store.select(selectSub);
  }

  ngOnInit(): void {
    console.log(this.subName);

    this.store.dispatch(getSub({ subName: this.subName }));
  }

  public goToCreatePostPage(): void {
    this.router.navigate([`r/${this.subName}/submit`]);
  }
}
