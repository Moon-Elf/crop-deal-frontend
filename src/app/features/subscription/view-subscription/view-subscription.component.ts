import { Component, OnInit } from '@angular/core';
import { SubscriptionDto } from '../../../models/subscription/subscription.model';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { CropDto } from '../../../models/crop/crop.model';
import { CropService } from '../../../core/services/crop.service';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal.component'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-subscription',
  standalone: true,
  imports: [CommonModule, PipesModule, RouterLink],
  templateUrl: './view-subscription.component.html',
  styleUrl: './view-subscription.component.scss'
})
export class ViewSubscriptionComponent implements OnInit {
  list?: SubscriptionDto[];
  cropDetailsMap: { [cropId: string]: CropDto } = {};
  loading = true;
  error = '';

  constructor(
    private subscriptionService: SubscriptionService,
    private cropService: CropService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }
  
  loadSubscriptions(): void {
    this.loading = true;
    this.error = '';
    
    this.subscriptionService.getMy().subscribe({
      next: (data) => {
        this.list = data;
        this.loadCropDetails(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load subscriptions. Please try again later.';
        console.error("Error loading subscription details", err);
        this.loading = false;
      }
    });
  }

  loadCropDetails(subs: SubscriptionDto[]): void {
    const uniqueCropIds = new Set<string>();
    subs.forEach(sub => {
      if (!this.cropDetailsMap[sub.cropId]) {
        uniqueCropIds.add(sub.cropId);
      }
    });

    uniqueCropIds.forEach(id => {
      this.cropService.getCropById(id).subscribe({
        next: (crop) => this.cropDetailsMap[id] = crop,
        error: (err) => console.error(`Error loading crop with ID ${id}:`, err)
      });
    });
  }

  delete(id: string): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Unsubscribe';
    modalRef.componentInstance.message = 'Are you sure you want to unsubscribe from this crop?';
    modalRef.componentInstance.confirmText = 'Unsubscribe';
    modalRef.componentInstance.confirmClass = 'btn-danger';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.subscriptionService.delete(id).subscribe({
          next: () => {
            this.loadSubscriptions();
          },
          error: (err) => {
            console.error('Error unsubscribing:', err);
          }
        });
      }
    }).catch(() => {});
  }
}