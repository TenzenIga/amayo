import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DropdownComponent } from './dropdown/dropdown.component';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarService } from '@core/services/sidebar.service';
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
        FontAwesomeModule
      
    ],
})
export class NavbarComponent {
  private authService:AuthService = inject(AuthService);
  private sidebarService:SidebarService = inject(SidebarService);
  public faBars = faBars;

  public isloggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public toggleSidebar():void {
    this.sidebarService.toggle();
  }
}
