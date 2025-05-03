import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CropListing } from '../../models/crop-listing.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CropListingService {
  private baseUrl = `${environment.apiUrl}/CropListing`; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<CropListing[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => res.$values as CropListing[])
    );
  }
}
