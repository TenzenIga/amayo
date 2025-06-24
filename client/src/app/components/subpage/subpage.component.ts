import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Sub } from '@shared/interfaces/interfaces';
import { selectSub } from 'app/store/selectors/sub.selector';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/state/app.state';
import { getSub, subscribeToSub, unsubscribeSub } from 'app/store/actions/sub.action';
import { NgStyle } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SubInfoComponent } from '../sub-info/sub-info.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PushPipe } from '@ngrx/component';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';

@Component({
    selector: 'app-subpage',
    templateUrl: './subpage.component.html',
    styleUrls: ['./subpage.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgStyle, PostComponent, RouterLink, SidebarComponent, SubInfoComponent, LoaderComponent, DateAgoPipe, PushPipe, SubscribeButtonComponent]
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

 public subscribeToSub(subName: string) {
     this.store.dispatch(subscribeToSub({name: subName }));
   }
 
   public unsubscribeSub(subName: string) {
     this.store.dispatch(unsubscribeSub({name: subName }));
   }
}
