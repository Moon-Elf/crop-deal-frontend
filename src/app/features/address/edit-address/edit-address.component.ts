import { Component } from '@angular/core';
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
export class EditAddressComponent {
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
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Retrieve the address ID from the route parameters
    this.addressId = this.activatedRoute.snapshot.paramMap.get('id')!;

    // Fetch the current address details from the backend
    this.addressService.getById(this.addressId).subscribe({
      next: (address: AddressDto) => {
        this.addressForm.patchValue(address);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load address details.';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.addressForm.invalid) return;

    this.loading = true;
    const updatedAddress = { ...this.addressForm.value, id: this.addressId };
    this.addressService.update(updatedAddress).subscribe({
      next: () => {
        this.successMessage = 'Address updated successfully!';
        this.router.navigate(['/address']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update address.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
