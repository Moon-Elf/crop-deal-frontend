import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { AddressDto } from '../../../models/address/address.model';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchAddresses();
  }

  fetchAddresses() {
    this.loading = true;
    this.error = '';
    
    this.addressService.getAll().subscribe({
      next: (data) => {
        this.addresses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading addresses:', err);
        this.error = 'Failed to load addresses. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteAddress(id: string) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Delete Address';
    modalRef.componentInstance.message = 'Are you sure you want to delete this address?';
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.confirmClass = 'btn-danger';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.addressService.delete(id).subscribe({
          next: () => {
            this.fetchAddresses();
          },
          error: (err) => {
            console.error('Error deleting address:', err);
            this.error = 'Failed to delete address. Please try again.';
          }
        });
      }
    }).catch(() => {});
  }

  editAddress(id: string) {
    this.router.navigate(['/address/edit', id]);
  }

  addAddress() {
    this.router.navigate(['/address/add']);
  }
}