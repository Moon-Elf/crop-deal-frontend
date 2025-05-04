import { Component, OnInit } from '@angular/core';
import { CropDto } from '../../../models/crop/crop.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropType } from '../../../enums/crop-type.enum';
import { CropService } from '../../../core/services/crop.service';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { CommonModule } from '@angular/common';
import { CreateCropListingDto } from '../../../models/crop-listing/create-crop-listing.dto';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-listing.component.html',
  styleUrl: './add-listing.component.scss'
})
export class AddListingComponent implements OnInit {
  listingForm!: FormGroup;
  cropTypes = Object.values(CropType);
  allCrops: CropDto[] = [];
  filteredCrops: CropDto[] = [];

  constructor(private fb: FormBuilder, private cropService: CropService, private cropListingService: CropListingService, private toastr: ToastrService, private router: Router) {}
  
  ngOnInit(): void {
    this.listingForm = this.fb.group({
      cropType: [null, Validators.required],
      cropId: [null, Validators.required],
      pricePerKg: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      image: [null]
    });
    this.loadCrops();

    // Watch cropType and filter crops
    this.listingForm.get('cropType')?.valueChanges.subscribe(type => {
      this.filteredCrops = this.allCrops.filter(crop => crop.type === type);
      this.listingForm.get('cropId')?.reset();
    });
  }

  loadCrops(): void {
    this.cropService.getAllCrops().subscribe({
      next: (crops) => {
        this.allCrops = crops;
      },
      error: () => {
        console.error('Failed to load crops');
      }
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && !file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }    
    this.listingForm.patchValue({ image: file });
    this.listingForm.get('image')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.listingForm.invalid) return;

    const value: CreateCropListingDto = this.listingForm.value;
    console.log(value);
    this.cropListingService.createListing(value).subscribe({
      next: () => {
        this.toastr.success('Listing created successfully', 'Success', {
          timeOut: 3000
        });
        this.listingForm.reset();
        this.router.navigate(['/farmer/my-listing']);
      },
      error: () => {
        this.toastr.success('Error creating listing', 'Failed', {
          timeOut: 3000
        });
      }
    });

  }
  

}
