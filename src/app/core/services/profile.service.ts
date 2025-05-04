import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileDto } from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = `${environment.apiUrl}/Profile`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<ProfileDto> {
    return this.http.get<ProfileDto>(this.baseUrl);
  }

  updateProfile(profile: ProfileDto): Observable<any> {
    return this.http.put(this.baseUrl, profile);
  }
}
