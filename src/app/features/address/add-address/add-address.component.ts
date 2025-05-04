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
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.addressForm.invalid) return;

    this.loading = true;
    this.addressService.create(this.addressForm.value).subscribe({
      next: () => {
        this.successMessage = 'Address added successfully!';
        this.router.navigate(['/address']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to add address.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
