import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Sub } from '@shared/interfaces/interfaces';
import { selectSub } from 'app/store/selectors/sub.selector';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/state/app.state';
import {
  getSub,
  subscribeToSub,
  unsubscribeSub
} from 'app/store/actions/sub.action';
import { NgStyle } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SubInfoComponent } from '../sub-info/sub-info.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';
import { PushPipe } from '@ngrx/component';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';
import { SubpageDropdownComponent } from './subpage-dropdown/subpage-dropdown.component';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSubDialogComponent } from './edit-sub-dialog/edit-sub-dialog.component';

@Component({
  selector: 'app-subpage',
  templateUrl: './subpage.component.html',
  styleUrls: ['./subpage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgStyle,
    PostComponent,
    RouterLink,
    SidebarComponent,
    SubpageDropdownComponent,
    SubInfoComponent,
    LoaderComponent,
    DateAgoPipe,
    PushPipe,
    SubscribeButtonComponent,
    FontAwesomeModule
  ]
})
export class SubpageComponent implements OnInit {
  @ViewChild('avatarRef', { static: false }) avatarRef: ElementRef;

  private modalService = inject(NgbModal);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private store: Store<IAppState> = inject(Store);
  public readonly sub$: Observable<Sub> = this.store.select(selectSub);
  public subName: string;
  public faPen = faPen;
  public isFocused: boolean = false;
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
    this.store.dispatch(subscribeToSub({ name: subName }));
  }

  public unsubscribeSub(subName: string) {
    this.store.dispatch(unsubscribeSub({ name: subName }));
  }

  public onMouseEnter() {
    this.isFocused = true;
  }

  public onMouseLeave() {
    this.isFocused = false;
  }

  public openEditModal(sub): void {
    const modalRef = this.modalService.open(EditSubDialogComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.sub = sub;
  }
}
