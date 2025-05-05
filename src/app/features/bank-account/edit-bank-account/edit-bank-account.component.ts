import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccountService } from '../../../core/services/bank-account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-bank-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-bank-account.component.html',
  styleUrl: './edit-bank-account.component.scss'
})
export class EditBankAccountComponent implements OnInit {
  bankForm: FormGroup;
  submitting = false;
  error = '';
  bankId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bankAccountService: BankAccountService,
    private router: Router
  ) {
    this.bankForm = this.fb.group({
      id: [''],
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      bankName: ['', [Validators.required, Validators.maxLength(50)]],
      branchName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.bankId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.bankId) {
      this.error = 'No bank account ID provided';
      return;
    }

    this.loadBankAccount();
  }

  loadBankAccount(): void {
    this.submitting = true;
    this.bankAccountService.getById(this.bankId).subscribe({
      next: (data) => {
        this.bankForm.patchValue(data);
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load bank account details.';
        console.error(err);
        this.submitting = false;
      }
    });
  }

  onSubmit() {
    if (this.bankForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';

    this.bankAccountService.update(this.bankForm.value).subscribe({
      next: () => {
        this.router.navigate(['/bankaccount']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update bank account. Please try again.';
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