import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-listing.component.html',
  styleUrl: './edit-listing.component.scss'
})
export class EditListingComponent implements OnInit {
  listingForm!: FormGroup;
  cropTypes = Object.values(CropType);
  allCrops: CropDto[] = [];
  filteredCrops: CropDto[] = [];
  listingId!: string;
  originalImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cropService: CropService,
    private listingService: CropListingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadCropsAndListing(); // Use new function
  }
  
  loadCropsAndListing(): void {
    this.cropService.getAllCrops().subscribe({
      next: (crops) => {
        this.allCrops = crops;
        this.loadListing(); // Call only after crops are loaded
      },
      error: () => {
        this.toastr.error('Failed to load crops');
      }
    });
  }
  

  initForm(): void {
    this.listingForm = this.fb.group({
      cropType: [null, Validators.required],
      cropId: [null, Validators.required],
      pricePerKg: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      image: [null]
    });

    this.listingForm.get('cropType')?.valueChanges.subscribe(type => {
      this.filteredCrops = this.allCrops.filter(c => c.type === type);
      this.listingForm.get('cropId')?.reset();
    });
  }

  loadListing(): void {
    this.listingService.getById(this.listingId).subscribe({
      next: (listing) => {
        this.originalImageUrl = listing.imageUrl ?? null;
        this.originalImageUrl = `${environment.imageUrl}\\${this.originalImageUrl}`;
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
      },
      error: () => {
        this.toastr.error('Failed to load listing');
        this.router.navigate(['/farmer/my-listing']);
      }
    });
  }
  
  

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && !file.type.startsWith('image/')) {
      this.toastr.warning('Only image files are allowed');
      return;
    }

    this.listingForm.patchValue({ image: file });
    this.listingForm.get('image')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.listingForm.invalid) return;

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
        this.toastr.success('Listing updated successfully', 'Success', {
          timeOut: 3000
        });
        this.router.navigate(['/farmer/my-listing']);
      },
      error: () => {
        this.toastr.error('Update failed');
      }
    });
  }

  getCropNameById(id: number | string): string | undefined {
    return this.allCrops.find(c => c.id === id)?.name;
  }
  
}
