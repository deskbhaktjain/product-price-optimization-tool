import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Create Account</h2>
        <p class="subtitle">Join Price Optimization Tool</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              placeholder="Enter your full name"
              class="form-control"
            />
            <small *ngIf="name?.invalid && name?.touched" class="error">
              Name is required
            </small>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              class="form-control"
            />
            <small *ngIf="email?.invalid && email?.touched" class="error">
              Please enter a valid email
            </small>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Enter your password"
              class="form-control"
            />
            <small *ngIf="password?.invalid && password?.touched" class="error">
              Password must be at least 6 characters
            </small>
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <select formControlName="role" class="form-control">
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <button type="submit" [disabled]="!registerForm.valid || isLoading" class="btn-primary">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <p class="login-link">
            Already have an account? <a routerLink="/login">Sign in here</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
    }

    .register-card {
      background: #363636;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      width: 100%;
      max-width: 400px;
      border: 1px solid #00BCD4;
    }

    h2 {
      text-align: center;
      color: #00BCD4;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      text-align: center;
      color: #B0BEC5;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #ffffff;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #424242;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
      background-color: #2a2a2a;
      color: #ffffff;
    }

    .form-control:focus {
      outline: none;
      border-color: #00BCD4;
      box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
    }

    small.error {
      color: #F44336;
      display: block;
      margin-top: 0.25rem;
      font-size: 0.85rem;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background-color: #00BCD4;
      color: #2a2a2a;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 1rem;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #80DEEA;
    }

    .btn-primary:disabled {
      background-color: #616161;
      cursor: not-allowed;
      color: #9E9E9E;
    }

    .error {
      color: #F44336;
      text-align: center;
      margin-top: 1rem;
    }

    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #B0BEC5;
    }

    .login-link a {
      color: #00BCD4;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['buyer', [Validators.required]]
    });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password, role } = this.registerForm.value;

    this.authService.register(name, email, password, role).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
