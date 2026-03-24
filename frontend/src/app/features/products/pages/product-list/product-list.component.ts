import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '@app/core/services/api.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="product-list-container">
      <div class="list-header">
        <h1>Product Management</h1>
        <button *ngIf="(canCreate$ | async)" routerLink="/products/create" class="btn-add">
          + Add New Product
        </button>
      </div>

      <div class="filters">
        <input
          type="text"
          placeholder="Search products..."
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          class="search-input"
        />

        <select [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange()" class="category-select">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div class="table-container" *ngIf="!loading; else loadingTemplate">
        <table class="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Description</th>
              <th>Available Stock</th>
              <th>Units Sold</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.cost_price | currency }}</td>
              <td>{{ product.selling_price | currency }}</td>
              <td>{{ product.description | slice: 0: 50 }}...</td>
              <td>{{ product.stock_available }}</td>
              <td>{{ product.units_sold }}</td>
              <td>
                <span class="rating">{{ product.customer_rating }}/5</span>
              </td>
              <td>
                <div class="actions">
                  <button routerLink="/products/{{ product._id }}" class="btn-view" title="View">👁️</button>
                  <button *ngIf="(canEdit$ | async)" routerLink="/products/edit/{{ product._id }}" class="btn-edit" title="Edit">✏️</button>
                  <button *ngIf="(canDelete$ | async)" (click)="deleteProduct(product._id)" class="btn-delete" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading">Loading products...</div>
      </ng-template>

      <div class="pagination">
        <button 
          (click)="previousPage()" 
          [disabled]="currentPage === 1"
          class="btn-pagination"
        >
          ← Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          (click)="nextPage()" 
          [disabled]="currentPage >= totalPages"
          class="btn-pagination"
        >
          Next →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
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

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-3xl);
      gap: var(--spacing-lg);
    }

    .list-header h1 {
      font-size: var(--font-3xl);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .btn-add {
      background: linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%);
      color: #1a1a1a;
      border: none;
      padding: var(--spacing-md) var(--spacing-xl);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: var(--font-semibold);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-primary);
      white-space: nowrap;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-primary-lg);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
    }

    .filters {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-2xl);
      flex-wrap: wrap;
    }

    .search-input,
    .category-select {
      padding: var(--spacing-md);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: var(--font-base);
      flex: 1;
      min-width: 200px;
      background-color: var(--card-background);
      color: var(--text-primary);
      transition: all var(--transition-base);
    }

    .search-input:focus,
    .category-select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.15);
      background: linea-gradient(180deg, rgba(0, 188, 212, 0.05), transparent);
    }

    .search-input::placeholder {
      color: var(--text-tertiary);
    }

    .table-container {
      background: var(--card-background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: auto;
      border: 1px solid var(--border-color);
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
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
      white-space: nowrap;
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

    .rating {
      background: linear-gradient(135deg, #FF9800, #FFB74D);
      color: #1a1a1a;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-sm);
      font-weight: var(--font-semibold);
      font-size: var(--font-sm);
      display: inline-block;
    }

    .actions {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .btn-view,
    .btn-edit,
    .btn-delete {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all var(--transition-base);
      padding: 0.25rem 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-view:hover {
      transform: scale(1.2) translateY(-2px);
      filter: drop-shadow(0 2px 4px rgba(0, 188, 212, 0.3));
    }

    .btn-edit:hover {
      transform: scale(1.2) translateY(-2px);
      filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
    }

    .btn-delete:hover {
      transform: scale(1.2) translateY(-2px);
      filter: drop-shadow(0 2px 4px rgba(244, 67, 54, 0.3));
    }

    .loading {
      padding: var(--spacing-3xl);
      text-align: center;
      color: var(--text-tertiary);
      font-size: var(--font-base);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-lg);
      margin-top: var(--spacing-2xl);
    }

    .btn-pagination {
      background: linear-gradient(135deg, #00BCD4 0%, #00ACC1 100%);
      color: #1a1a1a;
      border: none;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      font-weight: var(--font-semibold);
      font-size: var(--font-sm);
      box-shadow: var(--shadow-primary);
    }

    .btn-pagination:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-primary-lg);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
    }

    .btn-pagination:disabled {
      background: var(--card-background);
      color: var(--text-tertiary);
      cursor: not-allowed;
      border: 1.5px solid var(--border-color);
      box-shadow: none;
    }

    .page-info {
      color: var(--text-secondary);
      font-weight: 600;
      font-size: var(--font-base);
    }

    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filters {
        flex-direction: column;
      }

      .search-input,
      .category-select {
        min-width: 100%;
      }

      .products-table th,
      .products-table td {
        padding: var(--spacing-md);
        font-size: 0.9rem;
      }

      .actions {
        flex-direction: row;
        gap: var(--spacing-sm);
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  products: any[] = [];
  categories: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  currentPage = 1;
  totalPages = 1;
  loading = false;

  canCreate$ = this.authService.currentUser$.pipe();
  canEdit$ = this.authService.currentUser$.pipe();
  canDelete$ = this.authService.currentUser$.pipe();

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts(this.currentPage, 10, this.searchTerm, this.selectedCategory).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          this.totalPages = response.pagination.pages;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }
}
