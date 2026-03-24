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

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .list-header h1 {
      font-size: 1.8rem;
      color: #00BCD4;
      margin: 0;
    }

    .btn-add {
      background-color: #00BCD4;
      color: #2a2a2a;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s;
    }

    .btn-add:hover {
      background-color: #80DEEA;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .search-input,
    .category-select {
      padding: 0.75rem;
      border: 1px solid #424242;
      border-radius: 4px;
      font-size: 1rem;
      flex: 1;
      min-width: 200px;
      background-color: #363636;
      color: #ffffff;
    }

    .search-input:focus,
    .category-select:focus {
      outline: none;
      border-color: #00BCD4;
      box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
    }

    .search-input::placeholder {
      color: #9E9E9E;
    }

    .table-container {
      background: #363636;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      overflow-x: auto;
      border: 1px solid #424242;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th {
      background-color: #2a2a2a;
      color: #00BCD4;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #424242;
      white-space: nowrap;
    }

    .products-table td {
      padding: 1rem;
      border-bottom: 1px solid #424242;
      color: #ffffff;
    }

    .products-table tr:hover {
      background-color: #2a2a2a;
    }

    .rating {
      background-color: #FF9800;
      color: #2a2a2a;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-view,
    .btn-edit,
    .btn-delete {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      transition: transform 0.2s;
      padding: 0.25rem;
    }

    .btn-view:hover,
    .btn-edit:hover,
    .btn-delete:hover {
      transform: scale(1.2);
    }

    .loading {
      padding: 2rem;
      text-align: center;
      color: #B0BEC5;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-pagination {
      background-color: #00BCD4;
      color: #2a2a2a;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-weight: 600;
    }

    .btn-pagination:hover:not(:disabled) {
      background-color: #80DEEA;
    }

    .btn-pagination:disabled {
      background-color: #616161;
      cursor: not-allowed;
      color: #9E9E9E;
    }

    .page-info {
      color: #B0BEC5;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
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
        padding: 0.75rem 0.5rem;
        font-size: 0.9rem;
      }

      .actions {
        flex-direction: column;
        gap: 0.25rem;
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
