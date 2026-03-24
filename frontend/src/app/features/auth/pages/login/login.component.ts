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
      background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
      background-attachment: fixed;
      padding: var(--spacing-lg);
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .login-card {
      background: rgba(47, 47, 47, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: var(--spacing-3xl);
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      width: 100%;
      max-width: 420px;
      border: 1px solid rgba(0, 188, 212, 0.3);
      animation: slideInUp 0.5s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h2 {
      text-align: center;
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-sm);
      font-size: var(--font-2xl);
      font-weight: var(--font-bold);
    }

    .subtitle {
      text-align: center;
      color: var(--text-tertiary);
      margin-bottom: var(--spacing-2xl);
      font-size: var(--font-base);
      font-weight: var(--font-medium);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      font-size: var(--font-sm);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-control {
      width: 100%;
      padding: var(--spacing-md);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: var(--font-base);
      transition: all var(--transition-base);
      background: rgba(26, 26, 26, 0.5);
      color: var(--text-primary);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(0, 188, 212, 0.15);
      background: rgba(0, 188, 212, 0.05);
    }

    .form-control::placeholder {
      color: var(--text-tertiary);
    }

    small.error {
      color: #EF5350;
      display: block;
      margin-top: var(--spacing-sm);
      font-size: var(--font-sm);
      font-weight: var(--font-medium);
      animation: slideInUp var(--transition-base);
    }

    .btn-primary {
      width: 100%;
      padding: var(--spacing-md) var(--spacing-lg);
      background: linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%);
      color: #1a1a1a;
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-base);
      font-weight: var(--font-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      margin-top: var(--spacing-xl);
      box-shadow: var(--shadow-primary);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-primary-lg);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-primary:disabled {
      background: var(--card-background);
      color: var(--text-tertiary);
      cursor: not-allowed;
      border: 1.5px solid var(--border-color);
      box-shadow: none;
    }

    .error {
      color: #EF5350;
      text-align: center;
      margin-top: var(--spacing-lg);
      font-weight: var(--font-medium);
      animation: slideInUp var(--transition-base);
    }

    .divider {
      text-align: center;
      margin: var(--spacing-xl) 0;
      color: var(--text-tertiary);
      font-size: var(--font-sm);
      font-weight: var(--font-semibold);
      position: relative;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: var(--border-light);
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .register-link {
      text-align: center;
      margin-top: var(--spacing-lg);
      color: var(--text-tertiary);
      font-size: var(--font-sm);
    }

    .register-link a {
      color: #26E0E0;
      text-decoration: none;
      font-weight: var(--font-semibold);
      transition: all var(--transition-base);
      border-bottom: 1px solid transparent;
    }

    .register-link a:hover {
      border-bottom-color: #26E0E0;
    }

    .demo-credentials {
      background: rgba(0, 188, 212, 0.08);
      padding: var(--spacing-lg);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-2xl);
      font-size: var(--font-sm);
      border: 1.5px solid rgba(0, 188, 212, 0.2);
    }

    .demo-credentials h4 {
      margin: 0 0 var(--spacing-sm) 0;
      color: #26E0E0;
      font-weight: var(--font-semibold);
    }

    .demo-credentials p {
      margin: var(--spacing-xs) 0;
      color: var(--text-secondary);
      font-family: 'Monaco', 'Menlo', monospace;
      letter-spacing: 0.3px;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: var(--spacing-2xl);
      }

      h2 {
        font-size: var(--font-xl);
      }

      .btn-primary {
        padding: var(--spacing-md);
      }
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
