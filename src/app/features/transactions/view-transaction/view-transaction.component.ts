import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { UserService } from '../../../core/services/user.service';
import { CropService } from '../../../core/services/crop.service';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { TransactionDto } from '../../../models/transaction/transaction.model';
import { UserDto } from '../../../models/user/user.model';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { CropDto } from '../../../models/crop/crop.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { TransactionStatus } from '../../../enums/transaction-status.enum';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [CommonModule, RouterLink, PipesModule],
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {
  @ViewChild('receipt', { static: false }) receipt!: ElementRef;

  transactionId!: string;
  transaction?: TransactionDto;
  farmer?: UserDto;
  dealer?: UserDto;
  cropListing?: CropListing;
  crop?: CropDto;

  userRole: string = '';
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private userService: UserService,
    private cropService: CropService,
    private cropListingService: CropListingService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id') || '';
    this.userRole = this.authService.getUserRole();
    this.loadTransaction();
  }

  loadTransaction(): void {
    this.transactionService.getTransactionById(this.transactionId).subscribe({
      next: (data) => {
        this.transaction = data;
        this.loadCropListing(data.listingId);
        this.loadDealer(data.dealerId);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadCropListing(id: string): void {
    this.cropListingService.getById(id).subscribe({
      next: (listing) => {
        this.cropListing = listing;
        this.loadFarmer(listing.farmerId);
        this.loadCrop(listing.cropId);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadFarmer(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.farmer = user;
      },
      error: () => {
        console.warn('Could not load farmer');
      }
    });
  }

  loadDealer(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.dealer = user;
      },
      error: () => {
        console.warn('Could not load dealer');
      }
    });
  }

  loadCrop(id: string): void {
    this.cropService.getCropById(id).subscribe({
      next: (crop) => {
        this.crop = crop;
        this.loading = false;
      },
      error: () => {
        console.warn('Could not load crop');
        this.loading = false;
      }
    });
  }

  transConfirm(): void {
    if (!this.transaction) return;
    this.transactionService.updateTransactionStatus(this.transaction.id, TransactionStatus.Completed).subscribe({
      next: () => {
        this.transaction!.status = TransactionStatus.Completed; // update local state
      },
      error: () => {
        console.error('Failed to confirm transaction.');
      }
    });
  }
  
  transCancel(): void {
    if (!this.transaction) return;
    this.transactionService.updateTransactionStatus(this.transaction.id, TransactionStatus.Cancelled).subscribe({
      next: () => {
        this.transaction!.status = TransactionStatus.Cancelled; // update local state
      },
      error: () => {
        console.error('Failed to cancel transaction.');
      }
    });
  }
  
  downloadReceipt(): void {
    if (!this.transaction) return;
  
    this.loading = true;
    const receiptElement = this.receipt.nativeElement;
  
    // Make the receipt visible temporarily
    receiptElement.style.display = 'block';
  
    // Configuration for html2canvas
    const options = {
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: receiptElement.scrollWidth,
      windowHeight: receiptElement.scrollHeight
    };
  
    html2canvas(receiptElement, options).then(canvas => {
      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`CropDeal_Receipt_${this.transaction?.id}.pdf`);
      
      // Hide the receipt element again
      receiptElement.style.display = 'none';
      this.loading = false;
    }).catch(err => {
      console.error('Error generating receipt:', err);
      receiptElement.style.display = 'none';
      this.loading = false;
      // Fallback to text-based PDF if HTML-to-PDF fails
      this.generateTextReceipt();
    });
  }

  // Alternative text-based PDF generation
  generateTextReceipt(): void {
    if (!this.transaction || !this.farmer || !this.dealer || !this.crop) return;

    const pdf = new jsPDF();
    
    // Add logo
    // pdf.addImage(logoData, 'JPEG', 10, 10, 50, 20);

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(58, 125, 68); // Primary green color
    pdf.text('CropDeal Transaction Receipt', 105, 20, { align: 'center' });

    // Transaction details
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0); // Black color
    
    pdf.text(`Transaction ID: ${this.transaction.id}`, 20, 40);
    pdf.text(`Date: ${new Date(this.transaction.createdAt).toLocaleString()}`, 20, 50);
    pdf.text(`Status: ${this.transaction.status}`, 20, 60);

    // Line separator
    pdf.setDrawColor(139, 90, 43); // Earth brown color
    pdf.line(20, 70, 190, 70);

    // Parties involved
    pdf.setFontSize(14);
    pdf.text('Parties Involved', 20, 80);

    pdf.setFontSize(12);
    pdf.text('Farmer:', 20, 90);
    pdf.text(`Name: ${this.farmer.name}`, 30, 100);
    pdf.text(`Email: ${this.farmer.email}`, 30, 110);
    if (this.farmer.phoneNumber) {
      pdf.text(`Phone: ${this.farmer.phoneNumber}`, 30, 120);
    }

    pdf.text('Dealer:', 110, 90);
    pdf.text(`Name: ${this.dealer.name}`, 120, 100);
    pdf.text(`Email: ${this.dealer.email}`, 120, 110);
    if (this.dealer.phoneNumber) {
      pdf.text(`Phone: ${this.dealer.phoneNumber}`, 120, 120);
    }

    // Line separator
    pdf.line(20, 130, 190, 130);

    // Crop details
    pdf.setFontSize(14);
    pdf.text('Crop Details', 20, 140);

    pdf.setFontSize(12);
    pdf.text(`Name: ${this.crop.name}`, 20, 150);
    pdf.text(`Type: ${this.crop.type}`, 20, 160);

    // Transaction summary
    pdf.setFontSize(14);
    pdf.text('Transaction Summary', 20, 180);

    pdf.setFontSize(12);
    pdf.text(`Quantity: ${this.transaction.quantity} kg`, 20, 190);
    pdf.text(`Original Price/kg: ₹${this.cropListing?.pricePerKg.toFixed(2)}`, 20, 200);
    pdf.text(`Final Price/kg: ₹${this.transaction.finalPricePerKg.toFixed(2)}`, 20, 210);
    
    pdf.setFontSize(16);
    pdf.setTextColor(58, 125, 68); // Primary green color
    pdf.text(`Total Amount: ₹${this.transaction.totalPrice.toFixed(2)}`, 20, 230);

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Thank you for using CropDeal!', 105, 280, { align: 'center' });
    pdf.text('This is an official transaction receipt.', 105, 285, { align: 'center' });

    pdf.save(`CropDeal_Receipt_${this.transaction.id}.pdf`);
  }
}
