import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Price Optimization Tool</h2>
        <p class="subtitle">Sign in to your account</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
              Password is required
            </small>
          </div>

          <button type="submit" [disabled]="!loginForm.valid || isLoading" class="btn-primary">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <div class="divider">OR</div>

          <p class="register-link">
            Don't have an account? <a routerLink="/register">Register here</a>
          </p>

          <div class="demo-credentials">
            <h4>Demo Credentials:</h4>
            <p>Admin: admin@example.com / admin123</p>
            <p>Buyer: buyer@example.com / buyer123</p>
            <p>Supplier: supplier@example.com / supplier123</p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
    }

    .login-card {
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

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      color: #9E9E9E;
    }

    .register-link {
      text-align: center;
      margin-top: 1rem;
      color: #B0BEC5;
    }

    .register-link a {
      color: #00BCD4;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .demo-credentials {
      background-color: #2a2a2a;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1.5rem;
      font-size: 0.85rem;
      border: 1px solid #424242;
    }

    .demo-credentials h4 {
      margin: 0 0 0.5rem 0;
      color: #00BCD4;
    }

    .demo-credentials p {
      margin: 0.25rem 0;
      color: #B0BEC5;
      font-family: monospace;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
  }
}
