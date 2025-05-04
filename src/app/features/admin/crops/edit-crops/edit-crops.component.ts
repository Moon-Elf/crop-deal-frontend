import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropType } from '../../../../enums/crop-type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { CropService } from '../../../../core/services/crop.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-crops',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-crops.component.html',
  styleUrl: './edit-crops.component.scss'
})
export class EditCropsComponent implements OnInit {
  cropForm!: FormGroup;
  cropTypes = Object.values(CropType);
  cropId!: string;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cropService: CropService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cropId = this.route.snapshot.paramMap.get('id')!;
    this.cropService.getCropById(this.cropId).subscribe({
      next: (crop) => {
        this.cropForm = this.fb.group({
          id: [this.cropId],
          name: [crop.name, Validators.required],
          type: [crop.type, Validators.required]
        });
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load crop data');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.cropForm.invalid) return;

    this.cropService.updateCrop(this.cropId, this.cropForm.value).subscribe({
      next: () => {
        this.toastr.success('Crop updated successfully');
        this.router.navigate(['/admin/crops']);
      },
      error: () => {
        this.toastr.error('Failed to update crop');
      }
    });
  }
}
