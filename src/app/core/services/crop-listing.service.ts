import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CropListing } from '../../models/crop-listing/crop-listing.model';
import { environment } from '../../../environments/environment';
import { CreateCropListingDto } from '../../models/crop-listing/create-crop-listing.dto';

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

  getMyListing(): Observable<CropListing[]> {
    return this.http.get<any>(`${this.baseUrl}/my`).pipe(
      map(res => res.$values as CropListing[])
    );
  }

  createListing(listing: CreateCropListingDto): Observable<any> {
    const formData = new FormData();
  
    formData.append('cropId', listing.cropId);
    formData.append('pricePerKg', listing.pricePerKg.toString());
    formData.append('quantity', listing.quantity.toString());
  
    if (listing.description) {
      formData.append('description', listing.description);
    }
  
    if (listing.image) {
      formData.append('image', listing.image);
    }
  
    return this.http.post(`${this.baseUrl}`, formData);
  }

  getById(id: string): Observable<CropListing> {
    return this.http.get<CropListing>(`${this.baseUrl}/${id}`);
  }
  
  updateListing(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  deleteListing(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }  
}
