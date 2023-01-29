import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  public loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  public logOut(): void {
    this.authService.logout();
  }
}
