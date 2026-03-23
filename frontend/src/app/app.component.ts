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
      background-color: #f5f5f5;
    }

    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      gap: 2rem;
    }

    .navbar-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
      flex: 1;
    }

    .navbar-menu a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .navbar-menu a:hover {
      opacity: 0.7;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      font-size: 0.9rem;
    }

    .logout-btn {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background-color: #c0392b;
    }

    .main-content {
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .navbar-content {
        flex-wrap: wrap;
        padding: 1rem;
        gap: 1rem;
      }

      .navbar-menu {
        width: 100%;
        gap: 1rem;
        order: 3;
      }

      .navbar-brand h1 {
        font-size: 1.2rem;
      }

      .main-content {
        padding: 1rem;
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
