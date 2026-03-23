import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="unauthorized-container">
      <div class="error-card">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this resource.</p>
        <button routerLink="/dashboard" class="btn-home">Go to Dashboard</button>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .error-card {
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    h1 {
      font-size: 5rem;
      color: #e74c3c;
      margin: 0;
      font-weight: 700;
    }

    h2 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0.5rem 0;
    }

    p {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin: 1rem 0;
    }

    .btn-home {
      background-color: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1rem;
      transition: background-color 0.3s;
    }

    .btn-home:hover {
      background-color: #5568d3;
    }
  `]
})
export class UnauthorizedComponent {}
