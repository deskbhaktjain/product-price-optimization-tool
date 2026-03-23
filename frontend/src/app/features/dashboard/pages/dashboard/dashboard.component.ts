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
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-card h3 {
      color: #7f8c8d;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 1rem;
      text-transform: uppercase;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
      margin: 0;
    }

    .quick-actions {
      margin-bottom: 3rem;
    }

    .quick-actions h2 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      background: white;
      border: 2px solid #e0e0e0;
      padding: 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s;
      font-size: 0.95rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .action-btn:hover {
      border-color: #667eea;
      background-color: #f5f7ff;
      transform: translateY(-2px);
    }

    .icon {
      font-size: 1.5rem;
    }

    .recent-products {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .recent-products h2 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th {
      background-color: #f8f9fa;
      color: #2c3e50;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
    }

    .products-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .products-table tr:hover {
      background-color: #f8f9fa;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
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
