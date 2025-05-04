import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-listing.component.html',
  styleUrl: './my-listing.component.scss'
})
export class MyListingComponent {
  listings: CropListing[] = [];
  loading = true;

  constructor(
    private listingService: CropListingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.listingService.getMyListing().subscribe({
      next: (data) => {
        this.listings = data.map(item => ({
          ...item,
          imageUrl: `${environment.imageUrl}${item.imageUrl}`
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onEdit(listingId: string): void {
    this.router.navigate([`/farmer/edit-listing/${listingId}`]);
  }

  onDelete(listingId: string): void {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    this.listingService.deleteListing(listingId).subscribe({
      next: () => {
        this.toastr.success('Listing deleted successfully');
        this.loadListings(); // refresh list
      },
      error: () => {
        this.toastr.error('Failed to delete listing');
      }
    });
  }
}
