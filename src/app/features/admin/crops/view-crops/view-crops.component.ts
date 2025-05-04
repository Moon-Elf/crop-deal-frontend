import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CropType } from '../../../../enums/crop-type.enum';
import { CropDto } from '../../../../models/crop/crop.model';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CropService } from '../../../../core/services/crop.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-view-crops',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-crops.component.html',
  styleUrl: './view-crops.component.scss'
})

export class ViewCropsComponent implements OnInit {
  crops: CropDto[] = [];
  filteredCrops: CropDto[] = [];
  cropTypes = Object.values(CropType);
  cropForm!: FormGroup;
  loading = true;
  private cropIdToDelete: string | null = null;
  private deleteModal!: Modal;

  constructor(
    private cropService: CropService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cropForm = this.fb.group({
      cropType: [''],
      searchTerm: ['']
    });

    this.deleteModal = new Modal(document.getElementById('deleteModal')!);

    this.cropService.getAllCrops().subscribe({
      next: (data) => {
        this.crops = data;
        this.filteredCrops = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.cropForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const { cropType, searchTerm } = this.cropForm.value;
    this.filteredCrops = this.crops.filter(crop =>
      (!cropType || crop.type === cropType) &&
      (!searchTerm || crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  onEdit(cropId: string): void {
    this.router.navigate([`/admin/edit-crop/${cropId}`]);
  }

  confirmDelete(cropId: string): void {
    this.cropIdToDelete = cropId;
    this.deleteModal.show();
  }

  onDelete(): void {
    if (!this.cropIdToDelete) return;

    this.cropService.deleteCrop(this.cropIdToDelete).subscribe({
      next: () => {
        this.toastr.success('Crop deleted successfully');
        this.crops = this.crops.filter(c => c.id !== this.cropIdToDelete);
        this.applyFilters();
        this.deleteModal.hide();
      },
      error: () => {
        this.toastr.error('Failed to delete crop');
        this.deleteModal.hide();
      }
    });

    this.cropIdToDelete = null;
  }
}
