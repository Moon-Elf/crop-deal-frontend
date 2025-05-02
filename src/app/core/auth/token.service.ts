import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'token';
  private tokenExpirationKey = 'tokenExpiration';

  setToken(token: string, expiration: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenExpirationKey, expiration);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // You can expand this later to check token expiration too
    return !!token;
  }
  
}
