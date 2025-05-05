import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../auth/token.service'; // Adjust the import path
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
  
    if (!token || this.tokenService.isTokenExpired(token)) {
      console.log('Token invalid or expired. Redirecting to login...');
      this.router.navigate(['/auth/login']);
      return of(false);
    }
  
    return of(true); // Token exists and is valid
  }
  
}
