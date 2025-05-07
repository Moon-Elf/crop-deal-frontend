import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CreateSubsriptionDto, SubscriptionDto } from '../../models/subscription/subscription.model';
import { TransactionDto } from '../../models/transaction/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = `${environment.apiUrl}/Subscription`;
  constructor(private http: HttpClient) { }

  getMy(): Observable<SubscriptionDto[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => res.$values as SubscriptionDto[])
    );
  }

  getById(id: string): Observable<SubscriptionDto> {
    return this.http.get<SubscriptionDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateSubsriptionDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
