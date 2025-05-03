import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TokenService } from '../../core/auth/token.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, AsyncPipe, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isLoggedIn$ = this.tokenService.isLoggedIn$;

  constructor(private tokenService: TokenService, public router: Router) {}

  isAuthPage(): boolean {
    return this.router.url.includes('/auth');
  }
}
