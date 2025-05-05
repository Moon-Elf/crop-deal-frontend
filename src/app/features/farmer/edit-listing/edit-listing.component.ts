import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CropType } from '../../../enums/crop-type.enum';
import { CropService } from '../../../core/services/crop.service';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { ToastrService } from 'ngx-toastr';
import { CropDto } from '../../../models/crop/crop.model';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-listing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.scss']
})
export class EditListingComponent implements OnInit {
  listingForm: FormGroup;
  cropTypes = Object.values(CropType);
  allCrops: CropDto[] = [];
  filteredCrops: CropDto[] = [];
  listingId: string = '';
  originalImageUrl: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cropService: CropService,
    private listingService: CropListingService,
    private toastr: ToastrService
  ) {
    this.listingForm = this.fb.group({
      cropType: [null, Validators.required],
      cropId: [null, Validators.required],
      pricePerKg: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get('id')!;
    this.loadCropsAndListing();
  }

  loadCropsAndListing(): void {
    this.loading = true;
    this.cropService.getAllCrops().subscribe({
      next: (crops) => {
        this.allCrops = crops;
        this.loadListing();
      },
      error: (err) => {
        this.toastr.error('Failed to load crops');
        this.loading = false;
      }
    });
  }

  loadListing(): void {
    this.listingService.getById(this.listingId).subscribe({
      next: (listing) => {
        this.originalImageUrl = listing.imageUrl ? `${environment.imageUrl}/${listing.imageUrl}` : null;
        const matchedCrop = this.allCrops.find(c => c.id === listing.cropId);
        const cropType = matchedCrop?.type ?? null;
        
        this.listingForm.patchValue({
          cropType: cropType,
          cropId: listing.cropId,
          pricePerKg: listing.pricePerKg,
          quantity: listing.quantity,
          description: listing.description,
        });

        this.filteredCrops = this.allCrops.filter(c => c.type === cropType);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load listing');
        this.router.navigate(['/farmer/my-listing']);
        this.loading = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastr.warning('Only image files are allowed');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.warning('Maximum file size is 5MB');
        return;
      }

      this.listingForm.patchValue({ image: file });
      this.listingForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.listingForm.invalid) {
      this.listingForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = new FormData();
    const value = this.listingForm.value;

    formData.append('id', this.listingId);
    formData.append('pricePerKg', value.pricePerKg);
    formData.append('quantity', value.quantity);
    formData.append('description', value.description || '');
    formData.append('cropId', value.cropId);

    if (value.image) {
      formData.append('image', value.image);
    }

    this.listingService.updateListing(this.listingId, formData).subscribe({
      next: () => {
        this.toastr.success('Listing updated successfully');
        this.router.navigate(['/farmer/my-listing']);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Failed to update listing');
      }
    });
  }

  getCropNameById(id: string): string {
    return this.allCrops.find(c => c.id === id)?.name || 'Unknown Crop';
  }
}