import { Component, OnInit } from '@angular/core';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { CropType } from '../../../enums/crop-type.enum';
import { CropService } from '../../../core/services/crop.service';
import { CropDto } from '../../../models/crop/crop.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.scss'
})
export class MarketplaceComponent implements OnInit {
  listings: CropListing[] = [];
  enrichedListings: (CropListing & { cropType: CropType; farmerName?: string })[] = [];
  cropMap = new Map<string, { type: CropType; name: string }>();
  filteredListings: (CropListing & { cropType: CropType; farmerName?: string })[] = [];
  cropTypes = Object.values(CropType);
  selectedType = '';
  searchTerm = '';
  loading = true;
  error = false;
  
  // Pagination
  page = 1;
  pageSize = 8;
  totalItems = 0;

  // Sorting
  sortField = 'pricePerKg';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortOptions = [
    { value: 'pricePerKg-asc', label: 'Price: Low to High' },
    { value: 'pricePerKg-desc', label: 'Price: High to Low' },
    { value: 'quantity-asc', label: 'Quantity: Low to High' },
    { value: 'quantity-desc', label: 'Quantity: High to Low' },
    { value: 'cropName-asc', label: 'Name: A to Z' },
    { value: 'cropName-desc', label: 'Name: Z to A' }
  ];
  selectedSort = 'pricePerKg-asc';

  constructor(
    private listingService: CropListingService,
    private cropService: CropService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMarketplaceData();
  }

  loadMarketplaceData(): void {
    this.loading = true;
    this.error = false;
    
    this.cropService.getAllCrops().subscribe({
      next: (crops: CropDto[]) => {
        crops.forEach(crop => this.cropMap.set(crop.id, { type: crop.type, name: crop.name }));

        this.listingService.getAll().subscribe({
          next: (data) => {
            this.listings = data.map(item => ({
              ...item,
              imageUrl: item.imageUrl ? `${environment.imageUrl}${item.imageUrl}` : this.getDefaultImage(item.cropId)
            }));

            this.enrichedListings = this.listings.map(listing => ({
              ...listing,
              cropType: this.cropMap.get(listing.cropId)?.type ?? CropType.Grain,
              // farmerName: listing.farmer?.name || 'Unknown Farmer'
            }));

            this.totalItems = this.enrichedListings.length;
            this.filterListings();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading listings:', err);
            this.loading = false;
            this.error = true;
          }
        });
      },
      error: (err) => {
        console.error('Error loading crops:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  getDefaultImage(cropId: string): string {
    const cropType = this.cropMap.get(cropId)?.type;
    const defaultImages = {
      [CropType.Grain]: 'assets/images/grain-default.jpg',
      [CropType.Vegetable]: 'assets/images/vegetable-default.jpg',
      [CropType.Fruit]: 'assets/images/fruit-default.jpg',
      // [CropType.Legume]: 'assets/images/legume-default.jpg',
      // [CropType.Nut]: 'assets/images/nut-default.jpg',
      // [CropType.Spice]: 'assets/images/spice-default.jpg',
    };
    return defaultImages[cropType as CropType] || 'assets/images/crop-default.jpg';
  }

  filterListings(): void {
    let results = this.enrichedListings.filter(item =>
      (!this.selectedType || item.cropType === this.selectedType) &&
      (!this.searchTerm || 
        item.cropName.toLowerCase().includes(this.searchTerm.trim().toLowerCase()) ||
        item.farmerName?.toLowerCase().includes(this.searchTerm.trim().toLowerCase()))
    );

    results = this.sortListings(results);

    this.totalItems = results.length;
    this.filteredListings = results;
    this.page = 1; // Reset to first page when filters change
  }

  sortListings(listings: any[]): any[] {
    const [field, direction] = this.selectedSort.split('-');
    this.sortField = field;
    this.sortDirection = direction as 'asc' | 'desc';

    return [...listings].sort((a, b) => {
      let comparison = 0;
      
      if (field === 'cropName') {
        comparison = a[field].localeCompare(b[field]);
      } else {
        comparison = a[field] - b[field];
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }

  onSortChange(): void {
    this.filterListings();
  }

  resetFilters(): void {
    this.selectedType = '';
    this.searchTerm = '';
    this.selectedSort = 'pricePerKg-asc';
    this.filterListings();
  }

  onPageChange(): void {
    // In case needed to handle page changes for API calls
    // Currently handled by template with client-side pagination
  }

  viewDetails(listing: CropListing): void {
    this.router.navigate(['/marketplace', listing.id]);
  }

  get paginatedListings(): any[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.filteredListings.slice(startIndex, startIndex + this.pageSize);
  }
}