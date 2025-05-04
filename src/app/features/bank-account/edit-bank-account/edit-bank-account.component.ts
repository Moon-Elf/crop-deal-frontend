import { Component } from '@angular/core';
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
export class EditBankAccountComponent {
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
      accountNumber: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      branchName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.bankId = this.route.snapshot.paramMap.get('id') || '';
    if (this.bankId) {
      this.bankAccountService.getById(this.bankId).subscribe({
        next: (data) => this.bankForm.patchValue(data),
        error: () => this.error = 'Failed to load bank account data.'
      });
    }
  }

  onSubmit() {
    if (this.bankForm.invalid) return;

    this.submitting = true;
    this.bankAccountService.update(this.bankForm.value).subscribe({
      next: () => this.router.navigate(['/bankaccount']),
      error: () => {
        this.error = 'Failed to update bank account.';
        this.submitting = false;
      }
    });
  }
}
