import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss'
})
export class AddAddressComponent {
  addressForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/)]]
    });
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.addressService.create(this.addressForm.value).subscribe({
      next: () => {
        this.successMessage = 'Address added successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/address']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add address. Please try again.';
        this.loading = false;
      }
    });
  }

  markAllAsTouched(): void {
    Object.values(this.addressForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/address']);
  }
}