import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { UserService } from '../../../core/services/user.service';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { UserDto } from '../../../models/user/user.model';
import { AuthService } from '../../../core/auth/auth.service'; 
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CropDto } from '../../../models/crop/crop.model';
import { CropService } from '../../../core/services/crop.service';
import { TokenService } from '../../../core/auth/token.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  listingId!: string;
  listing?: CropListing;
  loading = true;
  error = false;
  farmerLoading = false;
  farmerError = false;

  showFarmerDetails = false;
  farmerDetails?: UserDto;

  isDealer = false;
  cropDetails?: CropDto;
  
  constructor(
    private route: ActivatedRoute,
    private listingService: CropListingService,
    private userService: UserService,
    private authService: AuthService,
    private cropService: CropService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadListingDetails();
    this.isDealer = this.authService.getUserRole() === 'Dealer';
  }

  loadListingDetails(): void {
    this.listingId = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.error = false;

    this.listingService.getById(this.listingId).subscribe({
      next: (data) => {
        this.listing = {
          ...data,
          imageUrl: data.imageUrl ? `${environment.imageUrl}${data.imageUrl}` : 'assets/images/crop-default.jpg'
        };
        this.fetchCropDetails(this.listing.cropId);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  fetchCropDetails(cropId: string): void {
    this.cropService.getCropById(cropId).subscribe({
      next: (crop) => {
        this.cropDetails = crop;
      },
      error: () => {
        console.warn('Could not load crop details');
      }
    });
  }

  requestFarmerDetails(): void {
    if (!this.listing?.farmerId) {
      this.farmerError = true;
      return;
    }

    this.farmerLoading = true;
    this.farmerError = false;
    this.showFarmerDetails = true;
    
    this.userService.getUserById(this.listing.farmerId).subscribe({
      next: (user) => {
        this.farmerDetails = user;
        this.farmerLoading = false;
      },
      error: () => {
        this.farmerError = true;
        this.farmerLoading = false;
        console.error('Failed to fetch farmer details');
      }
    });
  }

  initiateTransaction(): void {
    // TODO: Implement transaction flow
    console.log('Initiating transaction for listing:', this.listingId);
    this.router.navigate(['/transactions/initiate', this.listingId]);
  }
}