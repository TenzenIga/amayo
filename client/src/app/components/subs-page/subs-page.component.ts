import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import {
  getSubsList,
  subscribeToSub,
  unsubscribeSub
} from 'app/store/actions/sub.action';
import { selectSubsList } from 'app/store/selectors/sub.selector';
import { IAppState } from 'app/store/state/app.state';
import { Sub } from 'app/store/state/sub.state';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subs-page',
  standalone: true,
  imports: [PushPipe, SubscribeButtonComponent, NgStyle, RouterLink],
  templateUrl: './subs-page.component.html',
  styleUrl: './subs-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubsPageComponent {
  private store: Store<IAppState> = inject(Store);
  public readonly subs$ = this.store.select(selectSubsList);

  ngOnInit() {
    this.store.dispatch(getSubsList());
  }

  public trackByFn(index: string, sub: Sub): number {
    return sub.id;
  }

  public subscribeToSub(subName: string) {
    this.store.dispatch(subscribeToSub({ name: subName }));
  }

  public unsubscribeSub(subName: string) {
    this.store.dispatch(unsubscribeSub({ name: subName }));
  }
}
