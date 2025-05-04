import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { AddressDto } from '../../../models/address.model';

@Component({
  selector: 'app-view-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-address.component.html',
  styleUrl: './view-address.component.scss'
})
export class ViewAddressComponent {
  addresses: AddressDto[] = [];
  loading = true;
  error = '';

  constructor(
    private addressService: AddressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAddresses();
  }

  fetchAddresses() {
    this.addressService.getAll().subscribe({
      next: (data) => {
        this.addresses = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load addresses.';
        this.loading = false;
      }
    });
  }

  deleteAddress(id: string) {
    if (!confirm('Are you sure you want to delete this address?')) return;

    this.addressService.delete(id).subscribe({
      next: () => this.fetchAddresses(),
      error: () => alert('Failed to delete address.')
    });
  }

  editAddress(id: string) {
    this.router.navigate(['/address/edit', id]);
  }

  addAddress() {
    this.router.navigate(['/address/add']);
  }
}
