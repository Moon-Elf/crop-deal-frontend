import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../core/interceptors/token.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    tap((response: any) => {
      this.tokenService.setToken(response.token, response.expiration);
    })
  );
}

logout(): void {
  this.tokenService.removeToken();
}

  

  signup(data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  
}
