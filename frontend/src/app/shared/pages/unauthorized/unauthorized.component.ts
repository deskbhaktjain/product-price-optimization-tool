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
      background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
    }

    .error-card {
      background: #363636;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      text-align: center;
      border: 1px solid #00BCD4;
    }

    h1 {
      font-size: 5rem;
      color: #F44336;
      margin: 0;
      font-weight: 700;
    }

    h2 {
      font-size: 2rem;
      color: #00BCD4;
      margin: 0.5rem 0;
    }

    p {
      color: #B0BEC5;
      font-size: 1.1rem;
      margin: 1rem 0;
    }

    .btn-home {
      background-color: #00BCD4;
      color: #2a2a2a;
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
      background-color: #80DEEA;
    }
  `]
})
export class UnauthorizedComponent {}
