import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../core/auth/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {}

  // Check if the user is authenticated (has a valid token)
  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  // Get the role of the logged-in user
  isFarmer(): boolean {
    return this.authService.getUserRole() === 'Farmer';
  }

  isDealer(): boolean {
    return this.authService.getUserRole() === 'Dealer';
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'Admin';
  }

  // Logout function
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
