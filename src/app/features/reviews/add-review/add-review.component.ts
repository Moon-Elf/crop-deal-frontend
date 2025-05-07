import { Component, OnInit } from '@angular/core';
import { TransactionDto } from '../../../models/transaction/transaction.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { UserService } from '../../../core/services/user.service';
import { CreateReviewDto } from '../../../models/review/review.model';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDto } from '../../../models/user/user.model';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { CropDto } from '../../../models/crop/crop.model';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { CropService } from '../../../core/services/crop.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [PipesModule, CommonModule, ReactiveFormsModule, RouterLink  ],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.scss'
})
export class AddReviewComponent implements OnInit {
  transactionId!: string;
  transaction!: TransactionDto;
  farmer!: UserDto;
  crop!: CropDto;
  loading = false;
  error = '';

  reviewForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private userService: UserService,
    private listingService: CropListingService,
    private cropService: CropService,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.transactionId) {
      this.error = 'No transaction ID provided';
      return;
    }
    this.loadTransaction();
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
    this.reviewForm.get('rating')?.markAsTouched();
  }

  loadTransaction(): void {
    this.transactionService.getTransactionById(this.transactionId).subscribe({
      next: (data) => {
        this.transaction = data;
        this.loadListing(data.listingId);
        this.loadDealer(data.dealerId);
      },
      error: (err) => {
        this.error = 'Failed to load transaction details. Please try again later.';
        console.error("Error Loading Transaction Details", err);
      }
    });
  }
  
  loadListing(listingId: string): void {
    this.listingService.getById(listingId).subscribe({
      next: (data) => {
        this.loadFarmer(data.farmerId);
        this.loadCrop(data.cropId);
      },
      error: (err) => {
        this.error = 'Failed to load crop details. Please try again later.';
        console.error("Error loading Crop Listing", err);
      }
    });
  }
  
  loadFarmer(farmerId: string): void {
    this.userService.getUserById(farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
      },
      error: (err) => {
        console.error("Error loading Farmer Details", err);
      }
    });
  }

  loadDealer(dealerId: string): void {
    this.userService.getUserById(dealerId).subscribe({
      next: (data) => {
        // Currently not displayed in template
      },
      error: (err) => {
        console.error("Error loading Dealer Details", err);
      }
    });
  }

  loadCrop(cropId: string): void {
    this.cropService.getCropById(cropId).subscribe({
      next: (data) => {
        this.crop = data;
      },
      error: (err) => {
        console.error("Error Loading Crop Details", err);
      }
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.farmer) return;

    this.loading = true;
    this.error = '';

    const reviewData: CreateReviewDto = {
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      transactionId: this.transactionId,
      farmerId: this.farmer.id
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        this.router.navigate(['/transactions'], {
          queryParams: { reviewSubmitted: true }
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to submit review. Please try again.';
        this.loading = false;
        console.error("Error submitting review:", err);
      }
    });
  }
}