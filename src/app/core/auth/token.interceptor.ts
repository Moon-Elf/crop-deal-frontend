import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

    // console.log('Interceptor executing!');
    const token = this.tokenService.getToken();
    // console.log('Token in Interceptor:', token);  // Log to check if token is present
  
    let authReq = req;
    if (token) {
      // console.log('Token found, adding to headers:', token.substring(0, 10) + '...');
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      // console.log('No token found');
    }

    // const publicUrls = [
    //   'api/CropListing',
    // ];
  
    // // Check if request URL is public
    // const isPublic = publicUrls.some(url => req.url.includes(url));
  
    // if (isPublic) {
    //   // Skip token attachment
    //   return next.handle(req);
    // }
  
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log('Interceptor caught error:', error.status);
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
}
