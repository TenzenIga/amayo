import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { DropdownComponent } from './dropdown/dropdown.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class NavbarComponent {
  private authService:AuthService = inject(AuthService);


  public isloggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public logOut(): void {
    this.authService.logout();
  }
}
