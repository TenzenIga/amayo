import { Component, inject, OnInit, Renderer2 } from '@angular/core';
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
export class AppComponent{
    private authService:AuthService = inject(AuthService);
    private renderer = inject(Renderer2);
    protected readonly sidebarService: SidebarService = inject(SidebarService);
    
    public ngOnInit(){
        const theme = localStorage.getItem('theme');
        const htmlTag = document.documentElement;
        if(theme){
            this.renderer.setAttribute(htmlTag, 'data-bs-theme', theme);
        }
    }

    public isloggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}
