import { Component, OnInit } from '@angular/core';
import { CropListingService } from '../../core/services/crop-listing.service';
import { CropListing } from '../../models/crop-listing/crop-listing.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CropType } from '../../enums/crop-type.enum';
import { CropService } from '../../core/services/crop.service';
import { CropDto } from '../../models/crop/crop.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.scss'
})
export class MarketplaceComponent implements OnInit {
  listings: CropListing[] = [];
  enrichedListings: (CropListing & { cropType: CropType })[] = [];
  cropMap = new Map<string, CropType>();
  filteredListings: (CropListing & { cropType: CropType })[] = [];
  cropTypes = Object.values(CropType);
  selectedType = '';
  searchTerm = '';
  loading = true;


  constructor(
    private listingService: CropListingService,
    private cropService: CropService
  ) {}

  ngOnInit(): void {
    this.cropService.getAllCrops().subscribe({
      next: (crops: CropDto[]) => {
        crops.forEach(crop => this.cropMap.set(crop.id, crop.type));

        this.listingService.getAll().subscribe({
          next: (data) => {
            this.listings = data.map(item => ({
              ...item,
              imageUrl: `${environment.imageUrl}${item.imageUrl}`
            }));

            this.enrichedListings = this.listings.map(listing => ({
              ...listing,
              cropType: this.cropMap.get(listing.cropId) ?? CropType.Grain
            }));

            this.filteredListings = [...this.enrichedListings];
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  filterListings(): void {
    this.filteredListings = this.enrichedListings.filter(item =>
      (!this.selectedType || item.cropType === this.selectedType) &&
      (!this.searchTerm || item.cropName.toLowerCase().includes(this.searchTerm.trim().toLowerCase()))
    );    
  }
}
