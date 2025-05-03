import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'token';
  private tokenExpirationKey = 'tokenExpiration';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  setToken(token: string, expiration: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenExpirationKey, expiration);
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
  
  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const decoded: any = this.decodeToken(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
  }

  decodeToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
