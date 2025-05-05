import { Component, OnInit } from '@angular/core';
import { CropDto } from '../../../models/crop/crop.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropType } from '../../../enums/crop-type.enum';
import { CropService } from '../../../core/services/crop.service';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { CreateCropListingDto } from '../../../models/crop-listing/create-crop-listing.dto';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss']
})
export class AddListingComponent implements OnInit {
  listingForm: FormGroup;
  cropTypes = Object.values(CropType);
  allCrops: CropDto[] = [];
  filteredCrops: CropDto[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private cropListingService: CropListingService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.listingForm = this.fb.group({
      cropType: ['', Validators.required],
      cropId: ['', Validators.required],
      pricePerKg: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadCrops();

    this.listingForm.get('cropType')?.valueChanges.subscribe(type => {
      this.filteredCrops = this.allCrops.filter(crop => crop.type === type);
      this.listingForm.get('cropId')?.reset();
    });
  }

  loadCrops(): void {
    this.loading = true;
    this.cropService.getAllCrops().subscribe({
      next: (crops) => {
        this.allCrops = crops;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load crops');
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
    
    const value: CreateCropListingDto = this.listingForm.value;
    this.cropListingService.createListing(value).subscribe({
      next: () => {
        this.toastr.success('Listing created successfully');
        this.router.navigate(['/farmer/my-listing']);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Failed to create listing');
      }
    });
  }
}