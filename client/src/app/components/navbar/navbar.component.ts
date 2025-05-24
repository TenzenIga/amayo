import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DropdownComponent } from './dropdown/dropdown.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        RouterLink,
        DropdownComponent,
        RouterLinkActive,
    ],
})
export class NavbarComponent {
  private authService:AuthService = inject(AuthService);


  public isloggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
