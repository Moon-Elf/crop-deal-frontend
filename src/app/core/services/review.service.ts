import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateReviewDto, ReviewDto, UpdateReviewDto } from '../../models/review/review.model';
import { map, Observable } from 'rxjs';
import { CropListing } from '../../models/crop-listing/crop-listing.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = `${environment.apiUrl}/Review`;

  constructor(private http: HttpClient) { }

  // Get All Review
  getAllReview(): Observable<ReviewDto[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(res => res.$values as ReviewDto[])
    );
  }

  // Get Review By Id
  getReviewById(id: string): Observable<ReviewDto> {
    return this.http.get<ReviewDto>(`${this.baseUrl}/${id}`);
  }

  // Create Review
  createReview(dto: CreateReviewDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, dto);
  }

  // Get Review of Farmer
  getReviewsByFarmer(farmerId: string): Observable<ReviewDto[]> {
    return this.http.get<any>(`${this.baseUrl}/farmer/${farmerId}`).pipe(
      map(res => res.$values as ReviewDto[])
    );
  }
  
  // Get Review of Dealer
  getReviewsByDealer(dealerId: string): Observable<ReviewDto[]> {
    return this.http.get<any>(`${this.baseUrl}/dealer/${dealerId}`).pipe(
      map(res => res.$values as ReviewDto[])
    );
  }

  // Get Review of Transaction
  getReviewByTransaction(transactionId: string): Observable<ReviewDto> {
    return this.http.get<ReviewDto>(`${this.baseUrl}/transaction/${transactionId}`);
  }

  // Update Review
  updateReview(reviewId: string, formData: UpdateReviewDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${reviewId}`, formData);
  }

  // Delete Review
  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reviewId}`);
  }

}
