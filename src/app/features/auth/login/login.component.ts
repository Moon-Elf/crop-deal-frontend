import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  ngOnInit() {
    const role = this.authService.getUserRole();
    if (role === 'Farmer') this.router.navigate(['/farmer']);
    else if (role === 'Dealer') this.router.navigate(['/dealer']);
    else if (role === 'Admin') this.router.navigate(['/admin']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log(response);
        const role = this.authService.getUserRole();
        console.log(role);

        if (role == 'Farmer') {
          this.router.navigate(['/farmer']);
        } else if (role == 'Dealer') {
          this.router.navigate(['/dealer']);
        } else if (role == 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']); // fallback
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}

