import { ChangeDetectionStrategy, Component, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {faCog, faMoon, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FontAwesomeModule, NgbDropdownModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements OnInit {
  public userImageUrl:string; 
  public faUser = faUser;
  private authService = inject(AuthService);
  private renderer = inject(Renderer2);
  public faCog = faCog;
  public faArrowRight = faSignOutAlt;
  public faMoon = faMoon;
  public isDarkTheme = true;
  
  public ngOnInit(){
    this.userImageUrl = localStorage.getItem('userImageUrl')
    
  }

  public logOut(): void {
    this.authService.logout();
  }
  
  public toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const htmlTag = document.documentElement;
    
    if (this.isDarkTheme) {
      this.renderer.setAttribute(htmlTag, 'data-bs-theme', 'dark');
    } else {
      this.renderer.removeAttribute(htmlTag, 'data-bs-theme');
    }
  }
}
