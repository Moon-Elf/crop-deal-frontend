import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { AddressDto } from '../../../models/address.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-address',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-address.component.html',
  styleUrl: './edit-address.component.scss'
})
export class EditAddressComponent implements OnInit {
  addressForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  addressId: string = '';

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/)]]
    });
  }

  ngOnInit(): void {
    this.addressId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    
    if (!this.addressId) {
      this.errorMessage = 'No address ID provided';
      return;
    }

    this.loadAddress();
  }

  loadAddress(): void {
    this.loading = true;
    this.addressService.getById(this.addressId).subscribe({
      next: (address: AddressDto) => {
        this.addressForm.patchValue(address);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load address details.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedAddress = { ...this.addressForm.value, id: this.addressId };
    this.addressService.update(updatedAddress).subscribe({
      next: () => {
        this.successMessage = 'Address updated successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/address']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update address. Please try again.';
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