import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccountService } from '../../../core/services/bank-account.service';
import { BankAccount } from '../../../models/bank-account.model';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-bank-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-bank-account.component.html',
  styleUrl: './view-bank-account.component.scss'
})
export class ViewBankAccountComponent {
  bankAccounts: BankAccount[] = [];
  loading = true;
  error = '';

  constructor(
    private bankAccountService: BankAccountService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchBankAccounts();
  }

  fetchBankAccounts() {
    this.loading = true;
    this.error = '';
    
    this.bankAccountService.getAll().subscribe({
      next: (data) => {
        this.bankAccounts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bank accounts:', err);
        this.error = 'Failed to load bank accounts. Please try again later.';
        this.loading = false;
      }
    });
  }

  formatAccountNumber(accountNumber: string): string {
    // Show only last 4 digits for security
    return `•••• ${accountNumber.slice(-4)}`;
  }

  onEdit(id: string) {
    this.router.navigate(['/bankaccount/edit', id]);
  }

  async onDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this bank account?');
    if (!confirmed) return;

    try {
      await this.bankAccountService.delete(id).toPromise();
      this.fetchBankAccounts();
    } catch (err) {
      console.error('Error deleting bank account:', err);
      this.error = 'Failed to delete bank account. Please try again.';
    }
  }

  onAdd() {
    this.router.navigate(['/bankaccount/add']);
  }
}