import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CropType } from '../../../../enums/crop-type.enum';
import { CropDto } from '../../../../models/crop/crop.model';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CropService } from '../../../../core/services/crop.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-view-crops',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './view-crops.component.html',
  styleUrls: ['./view-crops.component.scss']
})
export class ViewCropsComponent implements OnInit {
  crops: CropDto[] = [];
  filteredCrops: CropDto[] = [];
  cropTypes = Object.values(CropType);
  cropForm!: FormGroup;
  loading = true;
  deleting = false;
  private cropIdToDelete: string | null = null;
  private deleteModal!: Modal;

  constructor(
    private cropService: CropService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initModal();
    this.loadCrops();
  }

  initForm(): void {
    this.cropForm = this.fb.group({
      cropType: [''],
      searchTerm: ['']
    });

    this.cropForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  initModal(): void {
    this.deleteModal = new Modal(document.getElementById('deleteModal')!);
  }

  loadCrops(): void {
    this.loading = true;
    this.cropService.getAllCrops().subscribe({
      next: (data) => {
        this.crops = data;
        this.filteredCrops = [...data];
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load crops');
        console.error(err);
        this.loading = false;
      }
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

    this.deleting = true;
    this.cropService.deleteCrop(this.cropIdToDelete).subscribe({
      next: () => {
        this.toastr.success('Crop deleted successfully');
        this.crops = this.crops.filter(c => c.id !== this.cropIdToDelete);
        this.applyFilters();
        this.deleteModal.hide();
      },
      error: (err) => {
        this.toastr.error('Failed to delete crop');
        console.error(err);
        this.deleteModal.hide();
      },
      complete: () => {
        this.deleting = false;
        this.cropIdToDelete = null;
      }
    });
  }
}