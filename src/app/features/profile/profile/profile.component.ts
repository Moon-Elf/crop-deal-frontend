import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ProfileDto } from '../../../models/profile/profile.model';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    });

    this.fetchProfile();
  }

  fetchProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Update failed. Try again later.';
        this.successMessage = '';
      }
    });
  }
}