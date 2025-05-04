import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankAccountService } from '../../../core/services/bank-account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-bank-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      accountNumber: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      branchName: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.bankForm.invalid) return;

    this.submitting = true;
    this.bankAccountService.create(this.bankForm.value).subscribe({
      next: () => this.router.navigate(['/bankaccount']),
      error: () => {
        this.error = 'Failed to add bank account.';
        this.submitting = false;
      }
    });
  }
}
