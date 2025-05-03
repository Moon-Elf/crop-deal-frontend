import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '../../../core/auth/token.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent implements OnInit, OnDestroy {
  role: string = '';
  isLoggedIn: boolean = false;
  private sub = new Subscription();

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}

  ngOnInit() {
    this.sub = this.tokenService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.role = this.tokenService.getRole();
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
