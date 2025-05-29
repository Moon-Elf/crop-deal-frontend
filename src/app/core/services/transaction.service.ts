import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateTransactionDto } from '../../models/transaction/create-transaction.model';
import { map, Observable } from 'rxjs';
import { TransactionDto } from '../../models/transaction/transaction.model';
import { TransactionStatus } from '../../enums/transaction-status.enum';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = `${environment.apiUrl}/Transaction`;

  constructor(private http: HttpClient) { }

  createTransaction(dto: CreateTransactionDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  getMyTransactions(): Observable<TransactionDto[]> {
    return this.http.get<any>(`${this.baseUrl}/my`).pipe(
      map(res => res.$values as TransactionDto[])
    );
  }
  
  getTransactionById(id: string): Observable<TransactionDto> {
    console.log("Id is " + id);
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateTransactionStatus(id: string, status: TransactionStatus): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }  
}
