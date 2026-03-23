import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/core/services/api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-detail-container" *ngIf="product">
      <button (click)="goBack()" class="btn-back">← Back to Products</button>

      <div class="product-detail-card">
        <div class="product-header">
          <h1>{{ product.name }}</h1>
          <span class="badge">{{ product.category }}</span>
        </div>

        <div class="product-grid">
          <div class="detail-group">
            <h3>Pricing Information</h3>
            <div class="detail-row">
              <label>Cost Price:</label>
              <span>$ {{ product.cost_price }}</span>
            </div>
            <div class="detail-row">
              <label>Selling Price:</label>
              <span>$ {{ product.selling_price }}</span>
            </div>
            <div class="detail-row">
              <label>Profit Margin:</label>
              <span>{{ profitMargin }}%</span>
            </div>
          </div>

          <div class="detail-group">
            <h3>Inventory &amp; Sales</h3>
            <div class="detail-row">
              <label>Stock Available:</label>
              <span>{{ product.stock_available }} units</span>
            </div>
            <div class="detail-row">
              <label>Units Sold:</label>
              <span>{{ product.units_sold }}</span>
            </div>
            <div class="detail-row">
              <label>Total Revenue:</label>
              <span>$ {{ totalRevenue.toFixed(2) }}</span>
            </div>
          </div>

          <div class="detail-group">
            <h3>Performance</h3>
            <div class="detail-row">
              <label>Customer Rating:</label>
              <span class="rating">{{ product.customer_rating }}/5 ⭐</span>
            </div>
            <div class="detail-row">
              <label>Demand Forecast:</label>
              <span>{{ product.demand_forecast }}</span>
            </div>
            <div class="detail-row">
              <label>Optimized Price:</label>
              <span class="optimized">$ {{ product.optimized_price }}</span>
            </div>
          </div>
        </div>

        <div class="product-description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
        </div>

        <div class="product-actions">
          <button (click)="editProduct()" class="btn-action btn-edit">Edit Product</button>
          <button (click)="deleteProduct()" class="btn-action btn-delete">Delete Product</button>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="loading">
      Loading product details...
    </div>
  `,
  styles: [`
    .product-detail-container {
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

    .btn-back {
      background: #ecf0f1;
      color: #2c3e50;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      margin-bottom: 2rem;
      transition: background-color 0.3s;
    }

    .btn-back:hover {
      background-color: #bdc3c7;
    }

    .product-detail-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
    }

    .badge {
      background-color: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .detail-group {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .detail-group h3 {
      color: #2c3e50;
      font-size: 1.1rem;
      margin: 0 0 1rem 0;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      align-items: center;
    }

    .detail-row:last-child {
      margin-bottom: 0;
    }

    .detail-row label {
      font-weight: 600;
      color: #7f8c8d;
    }

    .detail-row span {
      color: #2c3e50;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .rating {
      background-color: #f1c40f;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
    }

    .optimized {
      color: #27ae60;
      background-color: #d5f4e6;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
    }

    .product-description {
      background: #ecf0f1;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .product-description h3 {
      color: #2c3e50;
      margin: 0 0 1rem 0;
    }

    .product-description p {
      color: #7f8c8d;
      line-height: 1.6;
      margin: 0;
    }

    .product-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-start;
    }

    .btn-action {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s;
    }

    .btn-edit {
      background-color: #667eea;
      color: white;
    }

    .btn-edit:hover {
      background-color: #5568d3;
    }

    .btn-delete {
      background-color: #e74c3c;
      color: white;
    }

    .btn-delete:hover {
      background-color: #c0392b;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .product-header {
        flex-direction: column;
        align-items: flex-start;
      }

      h1 {
        font-size: 1.5rem;
      }

      .product-grid {
        grid-template-columns: 1fr;
      }

      .product-actions {
        flex-direction: column;
      }

      .btn-action {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  product: any = null;
  loading = true;

  get profitMargin(): number {
    if (!this.product) return 0;
    const margin =
      ((this.product.selling_price - this.product.cost_price) /
        this.product.cost_price) *
      100;
    return Math.round(margin * 100) / 100;
  }

  get totalRevenue(): number {
    if (!this.product) return 0;
    return this.product.selling_price * this.product.units_sold;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.apiService.getProduct(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.product = response.data;
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  editProduct(): void {
    this.router.navigate(['/products/edit', this.product._id]);
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(this.product._id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
