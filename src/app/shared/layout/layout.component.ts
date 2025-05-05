import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  isHomePage(): boolean {
    return this.currentRoute === '/' || this.isAuthPage();
  }

  isAuthPage(): boolean {
    return this.currentRoute.startsWith('/auth');
  }

  showNavbar(): boolean {
    // Show navbar on home page and auth pages, hide on other pages when logged in
    return this.isHomePage() || this.isAuthPage();
  }

  showSidebar(): boolean {
    // Only show sidebar when user is logged in and not on home/auth pages
    return !this.isHomePage() && !this.isAuthPage();
  }
}