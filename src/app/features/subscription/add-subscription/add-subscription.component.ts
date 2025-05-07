import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropDto } from '../../../models/crop/crop.model';
import { CropType } from '../../../enums/crop-type.enum';
import { CropService } from '../../../core/services/crop.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss'
})
export class AddSubscriptionComponent implements OnInit {
  cropForm!: FormGroup;
  crops: CropDto[] = [];
  filteredCrops: CropDto[] = [];
  cropTypes: string[] = ['All', ...Object.values(CropType)];
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private cropService: CropService, 
    private subService: SubscriptionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cropForm = this.fb.group({
      cropType: ['All', Validators.required],
      cropId: ['', Validators.required]
    });

    this.loadCrops();

    this.cropForm.get('cropType')?.valueChanges.subscribe((type) => {
      this.filterCrops(type);
    });
  }

  loadCrops(): void {
    this.loading = true;
    this.cropService.getAllCrops().subscribe({
      next: (data) => {
        this.crops = data;
        this.filteredCrops = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load crops. Please try again later.';
        this.loading = false;
        console.error('Failed to load crops', err);
      }
    });
  }

  filterCrops(selectedType: string): void {
    if (selectedType === 'All') {
      this.filteredCrops = this.crops;
    } else {
      this.filteredCrops = this.crops.filter(crop => crop.type === selectedType);
    }
    this.cropForm.patchValue({ cropId: '' });
  }

  onSubmit(): void {
    if (this.cropForm.invalid) {
      this.cropForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const cropId = this.cropForm.value.cropId;
    this.subService.create({ cropId }).subscribe({
      next: () => {
        this.toastr.success('Subscription added successfully');
        this.router.navigate(['/subscription']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add subscription. Please try again.';
        this.loading = false;
        console.error('Failed to add subscription', err);
      }
    });
  }
}