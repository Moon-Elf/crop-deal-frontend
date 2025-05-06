import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CropListingService } from '../../../core/services/crop-listing.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropListing } from '../../../models/crop-listing/crop-listing.model';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../../models/user/user.model';
import { UserService } from '../../../core/services/user.service';
import { TokenService } from '../../../core/auth/token.service';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.scss'
})
export class CreateTransactionComponent implements OnInit{
  listingId!: string;
  listing!: CropListing;
  form!: FormGroup;
  loading = true;
  error = false;
  submitting = false;
  success = false;
  farmerDetails!: UserDto;
  dealerDetails!: UserDto;

  constructor(
    private route: ActivatedRoute,
    private listingService: CropListingService,
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get('id')!;
    this.loadListing();
    
  }
  
  loadListing(): void {
    this.listingService.getById(this.listingId).subscribe({
      next: (data) => {
        this.listing = data;
        // console.log(data);
        this.form = this.fb.group({
          quantity: [null, [Validators.required, Validators.min(1), Validators.max(data.quantity)]],
          finalPricePerKg: [data.pricePerKg, [Validators.required, Validators.min(1)]]
        });
        this.getFarmerDetails();
        this.getDealerDetails();
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    })
  }

  getFarmerDetails(): void {
    
    this.userService.getUserById(this.listing?.farmerId).subscribe({
      next: (user) => {
        this.farmerDetails = user;
        console.log("Farmer: ");
        console.log(user);
      },
      error: () => {
        console.error('Failed to fetch farmer details');
      }
    });
  }

  getDealerDetails(): void {
    this.userService.getUserById(this.tokenService.getId()).subscribe({
      next: (user) => {
        this.dealerDetails = user;
        console.log("Dealer: ");
        console.log(user);
      },
      error: () => {
        console.error('Failed to fetch dealer details');
      }
    })
  }

  get totalPrice(): number {
    if (!this.form) return 0;
    return this.form.value.quantity * this.form.value.finalPricePerKg;
  }

  submit(): void {
    if (!this.form.valid || !this.listing) return;

    this.submitting = true;
    const dto = {
      listingId: this.listing.id,
      quantity: this.form.value.quantity,
      finalPricePerKg: this.form.value.finalPricePerKg,
      totalPrice: this.totalPrice
    };

    this.transactionService.createTransaction(dto).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/transactions']), 2000);
      },
      error: () => {
        this.submitting = false;
        alert('Failed to create transaction');
      }
    });
  }
}
