import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropType } from '../../../../enums/crop-type.enum';
import { CropService } from '../../../../core/services/crop.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateCropDto } from '../../../../models/crop/create-crop.model';

@Component({
  selector: 'app-add-crops',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-crops.component.html',
  styleUrls: ['./add-crops.component.scss']
})
export class AddCropsComponent {
  cropForm: FormGroup;
  cropTypes = Object.values(CropType);
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.cropForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.cropForm.invalid) {
      this.cropForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value: CreateCropDto = this.cropForm.value;

    this.cropService.createCrop(value).subscribe({
      next: () => {
        this.toastr.success('Crop added successfully');
        this.router.navigate(['/admin/crops']);
      },
      error: (err) => {
        this.toastr.error('Failed to add crop');
        console.error(err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/crops']);
  }
}