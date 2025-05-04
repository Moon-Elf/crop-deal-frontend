import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { AddressDto, CreateAddressDto, UpdateAddressDto } from '../../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private baseUrl = `${environment.apiUrl}/Address`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<AddressDto[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(res => res.$values || []) // <-- Clean transformation
    );
  }

  getById(id: string): Observable<AddressDto> {
    return this.http.get<AddressDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateAddressDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  update(dto: UpdateAddressDto): Observable<any> {
    return this.http.put(this.baseUrl, dto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}?id=${id}`);
  }
}