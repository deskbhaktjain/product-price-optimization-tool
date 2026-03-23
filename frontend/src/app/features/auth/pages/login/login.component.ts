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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    small.error {
      color: #e74c3c;
      display: block;
      margin-top: 0.25rem;
      font-size: 0.85rem;
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background-color: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 1rem;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5568d3;
    }

    .btn-primary:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .error {
      color: #e74c3c;
      text-align: center;
      margin-top: 1rem;
    }

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      color: #bdc3c7;
    }

    .register-link {
      text-align: center;
      margin-top: 1rem;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .demo-credentials {
      background-color: #f5f7ff;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1.5rem;
      font-size: 0.85rem;
    }

    .demo-credentials h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .demo-credentials p {
      margin: 0.25rem 0;
      color: #7f8c8d;
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
