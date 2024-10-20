import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
  styleUrls: ['./subpage.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SubpageComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private store: Store<IAppState> = inject(Store);
  public readonly sub$: Observable<Sub>= this.store.select(selectSub);
  public subName: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.subName = routeParams['subName'];
      this.store.dispatch(getSub({ subName: this.subName }));
    });
  }
  public trackByFn(index: string, sub: Sub): number {
    return sub.id;
  }

  public onSubscribe() {
    
  }
}
