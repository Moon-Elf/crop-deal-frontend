import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionDto } from '../../../models/transaction/transaction.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../../shared/pipes/pipes.module';
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PipesModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  transactions: TransactionDto[] = [];
  filteredTransactions: TransactionDto[] = [];
  loading = true;
  error = false;
  userRole: string = '';
  statusFilter: string = '';
  reviewId?: string;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || 'unknown';
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = false;
    
    this.transactionService.getMyTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...data];
        this.loading = false;
        // console.log(data);
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  filterTransactions(): void {
    if (!this.statusFilter) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(
        tx => tx.status === this.statusFilter
      );
    }
  }

  getTotalAmount(): number {
    return this.filteredTransactions
      .filter(tx => tx.status === 'Completed')
      .reduce((sum, tx) => sum + tx.totalPrice, 0);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/transactions/view', id]);
  }

  giveReview(id: string): void {
    this.router.navigate([`/review/give/${id}`]);
  }

  viewReview(id: any): void {
    this.router.navigate([`/review/view/${id}`]);
  }
}