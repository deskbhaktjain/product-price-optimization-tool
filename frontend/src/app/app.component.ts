import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <nav class="navbar" *ngIf="(isAuthenticated$ | async)">
        <div class="navbar-content">
          <div class="navbar-brand">
            <h1>Price Optimization Tool</h1>
          </div>
          <div class="navbar-menu">
            <a routerLink="/dashboard">Dashboard</a>
            <a routerLink="/products">Products</a>
            <a routerLink="/demand-forecast">Demand Forecast</a>
            <a routerLink="/pricing-optimization">Pricing Optimization</a>
          </div>
          <div class="navbar-right">
            <span *ngIf="(currentUser$ | async) as user" class="user-info">
              Welcome, {{ user.name }}
            </span>
            <button (click)="logout()" class="logout-btn">Logout</button>
          </div>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-base) 100%);
      background-attachment: fixed;
    }

    /* Modern Navbar */
    .navbar {
      background: rgba(26, 26, 26, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: white;
      padding: 0;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(0, 188, 212, 0.2);
      animation: slideInDown 0.4s ease-out;
    }

    .navbar-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem var(--spacing-xl);
      gap: var(--spacing-2xl);
    }

    .navbar-brand h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #00BCD4 0%, #26E0E0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    .navbar-menu {
      display: flex;
      gap: var(--spacing-2xl);
      flex: 1;
      align-items: center;
    }

    .navbar-menu a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-base);
      font-weight: 500;
      font-size: 0.95rem;
      position: relative;
      padding: 0.5rem 0;
    }

    .navbar-menu a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #00BCD4, #26E0E0);
      transition: width var(--transition-base);
      border-radius: 1px;
    }

    .navbar-menu a:hover {
      color: #26E0E0;
    }

    .navbar-menu a:hover::after {
      width: 100%;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .user-info {
      font-size: 0.85rem;
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .logout-btn {
      background: linear-gradient(135deg, var(--danger-color) 0%, var(--danger-light) 100%);
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
    }

    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
    }

    .logout-btn:active {
      transform: translateY(0);
    }

    .main-content {
      flex: 1;
      animation: slideInUp 0.5s ease-out;
    }

    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: var(--spacing-2xl) var(--spacing-xl);
    }

    @media (max-width: 768px) {
      .navbar-content {
        flex-wrap: wrap;
        padding: 1rem var(--spacing-md);
        gap: var(--spacing-lg);
      }

      .navbar-menu {
        width: 100%;
        gap: var(--spacing-lg);
        order: 3;
        font-size: 0.9rem;
      }

      .navbar-brand h1 {
        font-size: 1.1rem;
        order: 1;
      }

      .navbar-right {
        order: 2;
        gap: var(--spacing-md);
      }

      .main-content {
        padding: var(--spacing-lg) var(--spacing-md);
      }
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AppComponent {
  private authService = inject(AuthService);

  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor() {
    this.isAuthenticated$ = new Observable(observer => {
      this.authService.token$.subscribe(token => {
        observer.next(!!token);
      });
    });
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
