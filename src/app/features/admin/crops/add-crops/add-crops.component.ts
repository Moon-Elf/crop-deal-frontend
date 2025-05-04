import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  styleUrl: './add-crops.component.scss'
})
export class AddCropsComponent implements OnInit {
  cropForm!: FormGroup;
  cropTypes = Object.values(CropType);
  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cropForm = this.fb.group({
      cropType: [null, Validators.required],
      name: [null, Validators.required]
    })
  }

  onSubmit(): void {
    if (this.cropForm.invalid) return;
  
    const value: CreateCropDto = this.cropForm.value;
    console.log(value);

    this.cropService.createCrop(value).subscribe({
      next: () => {
        this.toastr.success('Crop Added Successfully', 'Success', {
          timeOut: 3000
        })
      }
    })
  }
}
