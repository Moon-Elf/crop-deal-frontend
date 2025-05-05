import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-listing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-listing.component.html',
  styleUrls: ['./my-listing.component.scss']
})
export class MyListingComponent {
  listings: CropListing[] = [];
  loading = true;

  constructor(
    private listingService: CropListingService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.loading = true;
    this.listingService.getMyListing().subscribe({
      next: (data) => {
        this.listings = data.map(item => ({
          ...item,
          imageUrl: item.imageUrl ? `${environment.imageUrl}${item.imageUrl}` : ''
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading listings:', err);
        this.toastr.error('Failed to load listings');
        this.loading = false;
      }
    });
  }

  onEdit(listingId: string): void {
    this.router.navigate([`/farmer/edit-listing/${listingId}`]);
  }

  onDelete(listingId: string): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Delete Listing';
    modalRef.componentInstance.message = 'Are you sure you want to delete this listing?';
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.confirmClass = 'btn-danger';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.listingService.deleteListing(listingId).subscribe({
          next: () => {
            this.toastr.success('Listing deleted successfully');
            this.loadListings();
          },
          error: (err) => {
            console.error('Error deleting listing:', err);
            this.toastr.error('Failed to delete listing');
          }
        });
      }
    }).catch(() => {});
  }
}