import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CropDto } from '../../models/crop/crop.model';
import { map, Observable } from 'rxjs';
import { CreateCropDto } from '../../models/crop/create-crop.model';
import { EditCropDto } from '../../models/crop/edit-crop.model';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private baseUrl = `${environment.apiUrl}/Crop`;
  constructor(private http: HttpClient) { }

  getAllCrops(): Observable<CropDto[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => res.$values as CropDto[])
    );
  }

  createCrop(crop: CreateCropDto): Observable<any> {
    return this.http.post(this.baseUrl, crop);
  }

  getCropById(id: string): Observable<CropDto> {
    return this.http.get<CropDto>(`${this.baseUrl}/${id}`);
  }
  
  updateCrop(id: string, crop: EditCropDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, crop);
  }
  
  
  deleteCrop(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }  
}
