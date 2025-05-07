import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewDto, UpdateReviewDto } from '../../../models/review/review.model';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { UserDto } from '../../../models/user/user.model';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { UserService } from '../../../core/services/user.service';
import { TransactionDto } from '../../../models/transaction/transaction.model';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-edit-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PipesModule, RouterLink],
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.scss'
})
export class EditReviewComponent implements OnInit {
  reviewId!: string;
  reviewForm!: FormGroup;
  originalReview!: ReviewDto;
  farmer!: UserDto;
  listing!: CropListing;
  transaction!: TransactionDto;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router,
    private userService: UserService,
    private listingService: CropListingService,
    private transactionService: TransactionService
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.reviewId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.reviewId) {
      this.error = 'No review ID provided';
      return;
    }
    this.loadReview();
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
    this.reviewForm.get('rating')?.markAsTouched();
  }

  loadReview(): void {
    this.loading = true;
    this.reviewService.getReviewById(this.reviewId).subscribe({
      next: (review) => {
        this.originalReview = review;
        this.reviewForm.patchValue({
          rating: review.rating,
          comment: review.comment
        });
        this.loadUser(review.farmerId);
        this.loadTransaction(review.transactionId);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load review details. Please try again later.';
        this.loading = false;
        console.error('Error loading review', err);
      }
    });
  }

  loadUser(farmerId: string): void {
    this.userService.getUserById(farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
      },
      error: (err) => {
        console.error("Error Loading Farmer Details", err);
      }
    });
  }

  loadTransaction(transactionId: string): void {
    this.transactionService.getTransactionById(transactionId).subscribe({
      next: (data) => {
        this.transaction = data;
        this.loadListing(data.listingId);
      },
      error: (err) => {
        console.error("Error loading Transaction details", err);
      }
    });
  }

  loadListing(listingId: string): void {
    this.listingService.getById(listingId).subscribe({
      next: (data) => {
        this.listing = data;
      },
      error: (err) => {
        console.error("Error loading Listing details", err);
      }
    });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const updatedReview: UpdateReviewDto = this.reviewForm.value;
    this.reviewService.updateReview(this.reviewId, updatedReview).subscribe({
      next: () => {
        this.router.navigate(['/review'], {
          queryParams: { reviewUpdated: true }
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update review. Please try again.';
        this.loading = false;
        console.error('Error updating review', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/review']);
  }
}