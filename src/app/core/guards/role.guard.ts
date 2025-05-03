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
    const role = this.tokenService.getRole();
    console.log('Token role:', role);
    console.log('Expected role:', expectedRole);
    if (!this.tokenService.getToken() || !role || role !== expectedRole) {
      console.log('Role mismatch or missing token. Redirecting to login...');
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
