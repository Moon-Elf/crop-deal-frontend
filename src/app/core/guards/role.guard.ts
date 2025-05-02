import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = next.data['expectedRole'];
    const token = this.tokenService.getToken();
    const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const role = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log('Token role:', role);
    console.log('Expected role:', expectedRole);
    if (!token || !role || role !== expectedRole) {
      console.log('Role mismatch or missing token. Redirecting to login...');
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
