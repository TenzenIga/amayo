import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Sub } from '@shared/interfaces/interfaces';
import { getTopSubs } from 'app/store/actions/sub.action';
import { IAppState } from 'app/store/state/app.state';
import { selectTopSubs } from 'app/store/selectors/sub.selector';
import { NgStyle } from '@angular/common';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PushPipe } from '@ngrx/component';

@Component({
    selector: 'app-top-subs',
    templateUrl: './top-subs.component.html',
    styleUrls: ['./top-subs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgStyle, LoaderComponent, PushPipe]
})
export class TopSubsComponent implements OnInit {
  protected readonly store:Store<IAppState> = inject(Store);
  protected readonly router: Router = inject(Router);
  public readonly topSubs$: Observable<Sub[]> = this.store.select(selectTopSubs);

  ngOnInit(): void {
    this.store.dispatch(getTopSubs());
  }

  public goToSub(subname: string): void {
    this.router.navigate([`/r/${subname}`]);
  }

  public trackByFn(index: string, sub: Sub): number {
    return sub.id;
  }
}
