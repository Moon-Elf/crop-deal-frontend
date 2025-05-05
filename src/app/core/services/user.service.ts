import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserDto } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<UserDto> {
    const value = this.http.get<UserDto>(`${this.baseUrl}/${id}`); 
    return value;
  }
  
  getAllUsers(): Observable<UserDto[]> {
    const value = this.http.get<any>(this.baseUrl).pipe(
      map(res => res.$values || []) 
    );
    return value;
  }
}
