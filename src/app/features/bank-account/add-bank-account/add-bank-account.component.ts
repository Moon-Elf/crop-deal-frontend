import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankAccountService } from '../../../core/services/bank-account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-bank-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-bank-account.component.html',
  styleUrl: './add-bank-account.component.scss'
})
export class AddBankAccountComponent {
  bankForm: FormGroup;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private bankAccountService: BankAccountService,
    private router: Router
  ) {
    this.bankForm = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      bankName: ['', [Validators.required, Validators.maxLength(50)]],
      branchName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onSubmit() {
    if (this.bankForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';

    this.bankAccountService.create(this.bankForm.value).subscribe({
      next: () => {
        this.router.navigate(['/bankaccount']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add bank account. Please try again.';
        console.error(err);
        this.submitting = false;
      }
    });
  }

  markAllAsTouched(): void {
    Object.values(this.bankForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/bankaccount']);
  }
}