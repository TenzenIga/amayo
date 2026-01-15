import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import {
  NgbNavContent,
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLinkButton,
  NgbNavLinkBase,
  NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { selectUserInfo } from 'app/store/selectors/user.selector';
import { User } from 'app/store/state/user.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    NgbNavContent,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLinkButton,
    NgbNavLinkBase,
    NgbNavOutlet,
    FontAwesomeModule,
    PushPipe
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  checked = true;
  private store = inject(Store);
  public angleRight = faAngleRight;
  public readonly userinfo$: Observable<User> =
    this.store.select(selectUserInfo);
}
