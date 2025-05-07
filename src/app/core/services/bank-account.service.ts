import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BankAccount, CreateBankAccount, UpdateBankAccount } from '../../models/bank account/bank-account.model';
import { CropListing } from '../../models/crop-listing/crop-listing.model';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private baseUrl = `${environment.apiUrl}/BankAccount`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<BankAccount[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(res => res.$values || []) // <-- Clean transformation
    );
  }

  getById(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.baseUrl}/${id}`);
  }

  create(account: CreateBankAccount): Observable<any> {
    return this.http.post(this.baseUrl, account);
  }

  update(account: UpdateBankAccount): Observable<any> {
    return this.http.put(this.baseUrl, account);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
