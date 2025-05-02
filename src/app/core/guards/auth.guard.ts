import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../interceptors/token.service'; // Adjust the import path
import { map, take, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = this.tokenService.getToken();

    if (!token) {
      // If no token, navigate to login page
      this.router.navigate(['/login']);
      return of(false);
    }

    return of(true); // If token exists, allow route access
  }
}
