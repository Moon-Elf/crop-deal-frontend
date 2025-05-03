import { Component, OnInit } from '@angular/core';
import { CropListingService } from '../../core/services/crop-listing.service';
import { CropListing } from '../../models/crop-listing.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css'
})
export class MarketplaceComponent implements OnInit {
  listings: CropListing[] = [];
  loading = true;

  constructor(private listingService: CropListingService) {}

  ngOnInit(): void {
    this.listingService.getAll().subscribe({
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

}
