import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { UserService } from '../../../core/services/user.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { ReviewDto } from '../../../models/review/review.model';
import { UserDto } from '../../../models/user/user.model';
import { TransactionDto } from '../../../models/transaction/transaction.model';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { TokenService } from '../../../core/auth/token.service';

@Component({
  selector: 'app-view-review',
  standalone: true,
  imports: [CommonModule, RouterLink, PipesModule],
  templateUrl: './view-review.component.html',
  styleUrl: './view-review.component.scss'
})
export class ViewReviewComponent implements OnInit {
  reviewId!: string;
  review!: ReviewDto;
  farmer!: UserDto;
  dealer!: UserDto;
  transaction!: TransactionDto;
  listing!: CropListing;
  loading = true;
  error = '';
  userRole!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private userService: UserService,
    private transactionService: TransactionService,
    private listingService: CropListingService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.reviewId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.reviewId) {
      this.error = 'No review ID provided';
      return;
    }
    this.loadReview();
    this.userRole = this.tokenService.getRole();
  }

  loadReview(): void {
    this.loading = true;
    this.error = '';

    this.reviewService.getReviewById(this.reviewId).subscribe({
      next: (data) => {
        this.review = data;
        this.loadFarmer();
        this.loadDealer();
        this.loadTransaction();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load review details. Please try again later.';
        console.error('Error loading review details', err);
        this.loading = false;
      }
    });
  }
  
  loadFarmer(): void {
    this.userService.getUserById(this.review.farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
      },
      error: (err) => {
        console.error('Error loading farmer details', err);
      }
    });
  }
  
  loadDealer(): void {
    this.userService.getUserById(this.review.dealerId).subscribe({
      next: (data) => {
        this.dealer = data;
      },
      error: (err) => {
        console.error('Error loading dealer details', err);
      }
    });
  }
  
  loadTransaction(): void {
    this.transactionService.getTransactionById(this.review.transactionId).subscribe({
      next: (data) => {
        this.transaction = data;
        this.loadListing();
      },
      error: (err) => {
        console.error('Error loading transaction details', err);
      }
    });
  }

  loadListing(): void {
    this.listingService.getById(this.transaction.listingId).subscribe({
      next: (data) => {
        this.listing = data;
      },
      error: (err) => {
        console.error('Error loading listing details', err);
      }
    });
  }

  viewTransaction(id: string): void {
    this.router.navigate(['/transactions/view', id]);
  }
  
  
  editReview(id: string): void {
    this.router.navigate(['/review/edit', id]);
  }
}