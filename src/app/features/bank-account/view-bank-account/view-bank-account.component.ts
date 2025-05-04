import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccountService } from '../../../core/services/bank-account.service';
import { BankAccount } from '../../../models/bank-account.model';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchBankAccounts();
  }

  fetchBankAccounts() {
    this.loading = true;
    this.bankAccountService.getAll().subscribe({
      next: (data) => {
        console.log(data)
        this.bankAccounts = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bank accounts';
        this.loading = false;
      }
    });
  }

  onEdit(id: string) {
    this.router.navigate(['/bankaccount/edit', id]);
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this bank account?')) {
      this.bankAccountService.delete(id).subscribe(() => {
        this.fetchBankAccounts(); // Refresh list
      });
    }
  }

  onAdd() {
    this.router.navigate(['/bankaccount/add']);
  }
}
