import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../core/auth/token.service';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewDto } from '../../../models/review/review.model';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../../models/user/user.model';
import { UserService } from '../../../core/services/user.service';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, PipesModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent implements OnInit {
  userId!: string;
  userRole!: string;
  reviews?: ReviewDto[];
  farmerDetailsMap: { [userId: string]: UserDto } = {};
  dealerDetailsMap: { [userId: string]: UserDto } = {};
  loading = true;
  error = '';

  constructor(
    private tokenService: TokenService,
    private reviewService: ReviewService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.tokenService.getId();
    this.userRole = this.tokenService.getRole();
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = '';

    switch (this.userRole) {
      case 'Farmer':
        this.reviewService.getReviewsByFarmer(this.userId).subscribe({
          next: (data) => {
            this.reviews = data;
            this.loadDealerDetails(data);
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load reviews. Please try again later.';
            console.error("Error Loading Reviews:", err);
            this.loading = false;
          }
        });
        break;

      case 'Dealer':
        this.reviewService.getReviewsByDealer(this.userId).subscribe({
          next: (data) => {
            this.reviews = data;
            this.loadFarmerDetails(data);
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load reviews. Please try again later.';
            console.error("Error Loading Reviews:", err);
            this.loading = false;
          }
        });
        break;

      case 'Admin':
        this.reviewService.getAllReview().subscribe({
          next: (data) => {
            this.reviews = data;
            this.loadFarmerDetails(data);
            this.loadDealerDetails(data);
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load reviews. Please try again later.';
            console.error("Error Loading Reviews:", err);
            this.loading = false;
          }
        });
        break;
    }
  }

  loadFarmerDetails(reviews: ReviewDto[]): void {
    const uniqueFarmerIds = new Set<string>();
    reviews.forEach(review => {
      if (!this.farmerDetailsMap[review.farmerId]) {
        uniqueFarmerIds.add(review.farmerId);
      }
    });

    uniqueFarmerIds.forEach(id => {
      this.userService.getUserById(id).subscribe({
        next: (user) => this.farmerDetailsMap[id] = user,
        error: (err) => console.error(`Error loading farmer with ID ${id}:`, err)
      });
    });
  }

  loadDealerDetails(reviews: ReviewDto[]): void {
    const uniqueDealerIds = new Set<string>();
    reviews.forEach(review => {
      if (!this.dealerDetailsMap[review.dealerId]) {
        uniqueDealerIds.add(review.dealerId);
      }
    });

    uniqueDealerIds.forEach(id => {
      this.userService.getUserById(id).subscribe({
        next: (user) => this.dealerDetailsMap[id] = user,
        error: (err) => console.error(`Error loading dealer with ID ${id}:`, err)
      });
    });
  }

  viewReview(id: string): void {
    this.router.navigate(['/review/view', id]);
  }

  editReview(id: string): void {
    this.router.navigate(['/review/edit', id]);
  }
}