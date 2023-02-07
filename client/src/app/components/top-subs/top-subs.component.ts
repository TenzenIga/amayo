import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Sub } from '@shared/interfaces/interfaces';
import { getTopSubs } from 'app/store/actions/sub.action';
import { IAppState } from 'app/store/state/app.state';
import { selectTopSubs } from 'app/store/selectors/sub.selector';

@Component({
  selector: 'app-top-subs',
  templateUrl: './top-subs.component.html',
  styleUrls: ['./top-subs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopSubsComponent implements OnInit {
  public readonly topSubs$: Observable<Sub[]> =
    this.store.select(selectTopSubs);

  constructor(private store: Store<IAppState>, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(getTopSubs());
  }

  public goToSub(subname: string): void {
    this.router.navigate([`/r/${subname}`]);
  }
}
