import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '@app/core/services/api.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Price Optimization Tool</p>
      </div>

      <div class="dashboard-grid">
        <div class="stat-card">
          <h3>Total Products</h3>
          <p class="stat-number">{{ totalProducts }}</p>
        </div>

        <div class="stat-card">
          <h3>Total Revenue</h3>
          <p class="stat-number">{{ totalRevenue | currency }}</p>
        </div>

        <div class="stat-card">
          <h3>Avg Customer Rating</h3>
          <p class="stat-number">{{ avgRating.toFixed(2) }}</p>
        </div>

        <div class="stat-card">
          <h3>Total Stock</h3>
          <p class="stat-number">{{ totalStock }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button routerLink="/products" class="action-btn">
            <span class="icon">📦</span>
            <span>View Products</span>
          </button>
          <button *ngIf="(isAdmin$ | async)" routerLink="/products/create" class="action-btn">
            <span class="icon">➕</span>
            <span>Add Product</span>
          </button>
          <button routerLink="/demand-forecast" class="action-btn">
            <span class="icon">📊</span>
            <span>Demand Forecast</span>
          </button>
          <button routerLink="/pricing-optimization" class="action-btn">
            <span class="icon">💰</span>
            <span>Price Optimization</span>
          </button>
        </div>
      </div>

      <div class="recent-products" *ngIf="recentProducts.length > 0">
        <h2>Recent Products</h2>
        <table class="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of recentProducts">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>$ {{ product.cost_price }}</td>
              <td>$ {{ product.selling_price }}</td>
              <td>{{ product.stock_available }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      animation: slideInUp 0.4s ease-out;
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

    .dashboard-header {
      margin-bottom: var(--spacing-3xl);
      animation: slideInUp 0.5s ease-out 0.1s both;
    }

    .dashboard-header h1 {
      font-size: var(--font-3xl);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-sm);
    }

    .dashboard-header p {
      color: var(--text-tertiary);
      font-size: var(--font-lg);
      font-weight: var(--font-medium);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-xl);
      margin-bottom: var(--spacing-3xl);
    }

    .stat-card {
      background: linear-gradient(135deg, var(--card-background) 0%, rgba(47, 47, 47, 0.8) 100%);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;
      animation: slideInUp calc(0.4s + var(--card-delay, 0s)) ease-out both;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00BCD4, #26E0E0);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 188, 212, 0.15);
      border-color: rgba(0, 188, 212, 0.5);
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-card h3 {
      color: var(--text-tertiary);
      font-size: var(--font-sm);
      font-weight: var(--font-semibold);
      margin-bottom: var(--spacing-lg);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #26E0E0, #00BCD4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      line-height: 1.2;
    }

    .quick-actions {
      margin-bottom: var(--spacing-3xl);
      animation: slideInUp 0.5s ease-out 0.2s both;
    }

    .quick-actions h2 {
      font-size: var(--font-2xl);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-xl);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--spacing-lg);
    }

    .action-btn {
      background: var(--card-background);
      border: 1.5px solid var(--border-light);
      padding: var(--spacing-xl) var(--spacing-lg);
      border-radius: var(--radius-lg);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
      transition: all var(--transition-base);
      font-size: 0.95rem;
      color: #26E0E0;
      font-weight: 600;
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }

    .action-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(0, 188, 212, 0.1), transparent 70%);
      opacity: 0;
      transition: opacity var(--transition-base);
      pointer-events: none;
    }

    .action-btn:hover {
      border-color: #00BCD4;
      background: linear-gradient(135deg, rgba(0, 188, 212, 0.05), rgba(0, 188, 212, 0.02));
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 188, 212, 0.15);
    }

    .action-btn:hover::before {
      opacity: 1;
    }

    .icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0, 188, 212, 0.2));
    }

    .recent-products {
      background: var(--card-background);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
      animation: slideInUp 0.5s ease-out 0.3s both;
      overflow: hidden;
    }

    .recent-products h2 {
      font-size: var(--font-2xl);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-2xl);
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
      overflow: hidden;
    }

    .products-table th {
      background: linear-gradient(90deg, rgba(0, 188, 212, 0.1), transparent);
      color: #26E0E0;
      padding: var(--spacing-lg);
      text-align: left;
      font-weight: 600;
      font-size: var(--font-sm);
      letter-spacing: 0.5px;
      border-bottom: 2px solid var(--border-light);
      position: sticky;
      top: 0;
    }

    .products-table td {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-size: var(--font-base);
    }

    .products-table tbody tr {
      transition: all var(--transition-base);
    }

    .products-table tbody tr:hover {
      background: rgba(0, 188, 212, 0.05);
      border-bottom-color: rgba(0, 188, 212, 0.3);
    }

    .products-table tbody tr:last-child td {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
      }

      .stat-number {
        font-size: 2rem;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .products-table {
        font-size: 0.9rem;
      }

      .products-table th,
      .products-table td {
        padding: var(--spacing-md);
      }
    }

    @media (max-width: 480px) {
      .dashboard-header h1 {
        font-size: var(--font-2xl);
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .stat-number {
        font-size: 1.75rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  totalProducts = 0;
  totalRevenue = 0;
  totalStock = 0;
  avgRating = 0;
  recentProducts: any[] = [];
  isAdmin$ = this.authService.currentUser$.pipe();

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.apiService.getProducts(1, 100).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const products = response.data;
          this.totalProducts = products.length;

          this.totalRevenue = products.reduce((sum: number, p: any) => {
            return sum + (p.selling_price * p.units_sold);
          }, 0);

          this.totalStock = products.reduce((sum: number, p: any) => {
            return sum + p.stock_available;
          }, 0);

          this.avgRating =
            products.reduce((sum: number, p: any) => sum + p.customer_rating, 0) /
            (products.length || 1);

          this.recentProducts = products.slice(0, 5);
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }
}
