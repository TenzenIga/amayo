import { Component, inject } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left.component';
import { SidebarService } from '@core/services/sidebar.service';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [NavbarComponent, RouterOutlet, SidebarLeftComponent]
})
export class AppComponent {
    private authService:AuthService = inject(AuthService);
    protected readonly sidebarService: SidebarService = inject(SidebarService);
    
    public isloggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}
