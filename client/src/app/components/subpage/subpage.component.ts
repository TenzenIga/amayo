import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Sub } from '@shared/interfaces/interfaces';
import { selectSub } from 'app/store/selectors/sub.selector';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/state/app.state';
import { getSub } from 'app/store/actions/sub.action';

@Component({
  selector: 'app-subpage',
  templateUrl: './subpage.component.html',
  styleUrls: ['./subpage.component.scss']
})
export class SubpageComponent implements OnInit {
  public readonly sub$: Observable<Sub>;
  public subName: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<IAppState>
  ) {
    this.sub$ = this.store.select(selectSub);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.subName = routeParams['subName'];
      this.store.dispatch(getSub({ subName: this.subName }));
    });
  }
}
