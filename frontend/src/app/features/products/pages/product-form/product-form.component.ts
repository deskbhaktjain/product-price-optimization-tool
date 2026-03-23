import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/core/services/api.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="product-form-container">
      <h1>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h1>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Product Name *</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              placeholder="Enter product name"
              class="form-control"
            />
            <small *ngIf="name?.invalid && name?.touched" class="error">
              Product name is required
            </small>
          </div>

          <div class="form-group">
            <label for="category">Category *</label>
            <input
              type="text"
              id="category"
              formControlName="category"
              placeholder="e.g., Electronics, Clothing"
              class="form-control"
            />
            <small *ngIf="category?.invalid && category?.touched" class="error">
              Category is required
            </small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cost_price">Cost Price *</label>
            <input
              type="number"
              id="cost_price"
              formControlName="cost_price"
              placeholder="0.00"
              step="0.01"
              class="form-control"
            />
            <small *ngIf="cost_price?.invalid && cost_price?.touched" class="error">
              Valid cost price is required
            </small>
          </div>

          <div class="form-group">
            <label for="selling_price">Selling Price *</label>
            <input
              type="number"
              id="selling_price"
              formControlName="selling_price"
              placeholder="0.00"
              step="0.01"
              class="form-control"
            />
            <small *ngIf="selling_price?.invalid && selling_price?.touched" class="error">
              Valid selling price is required
            </small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="stock_available">Stock Available *</label>
            <input
              type="number"
              id="stock_available"
              formControlName="stock_available"
              placeholder="0"
              class="form-control"
            />
            <small *ngIf="stock_available?.invalid && stock_available?.touched" class="error">
              Valid stock is required
            </small>
          </div>

          <div class="form-group">
            <label for="units_sold">Units Sold</label>
            <input
              type="number"
              id="units_sold"
              formControlName="units_sold"
              placeholder="0"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="customer_rating">Customer Rating</label>
            <input
              type="number"
              id="customer_rating"
              formControlName="customer_rating"
              placeholder="0"
              min="0"
              max="5"
              step="0.1"
              class="form-control"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="Enter product description"
            rows="4"
            class="form-control"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="!productForm.valid || isLoading" class="btn-submit">
            {{ isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product' }}
          </button>
          <button type="button" (click)="onCancel()" class="btn-cancel">Cancel</button>
        </div>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
  `,
  styles: [`
    .product-form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 800px;
      margin: 0 auto;
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

    h1 {
      font-size: 1.8rem;
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-weight: 600;
      color: #2c3e50;
    }

    .form-control {
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

    textarea.form-control {
      resize: vertical;
      font-family: inherit;
    }

    small.error {
      color: #e74c3c;
      font-size: 0.85rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      grid-column: 1 / -1;
    }

    .btn-submit,
    .btn-cancel {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-submit {
      background-color: #667eea;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #5568d3;
    }

    .btn-submit:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .btn-cancel {
      background-color: #ecf0f1;
      color: #2c3e50;
    }

    .btn-cancel:hover {
      background-color: #bdc3c7;
    }

    .error {
      color: #e74c3c;
      margin-top: 1rem;
      text-align: center;
    }

    @media (max-width: 600px) {
      .product-form-container {
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  productForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  productId: string | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      cost_price: ['', [Validators.required, Validators.min(0)]],
      selling_price: ['', [Validators.required, Validators.min(0)]],
      stock_available: ['', [Validators.required, Validators.min(0)]],
      units_sold: [0, [Validators.min(0)]],
      customer_rating: [4, [Validators.min(0), Validators.max(5)]],
      description: ['']
    });
  }

  get name() {
    return this.productForm.get('name');
  }

  get category() {
    return this.productForm.get('category');
  }

  get cost_price() {
    return this.productForm.get('cost_price');
  }

  get selling_price() {
    return this.productForm.get('selling_price');
  }

  get stock_available() {
    return this.productForm.get('stock_available');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = id;
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.apiService.getProduct(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.productForm.patchValue(response.data);
        }
      },
      error: (error) => {
        this.errorMessage = 'Error loading product data';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (!this.productForm.valid) return;

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.productId) {
      this.apiService.updateProduct(this.productId, this.productForm.value).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error updating product';
        }
      });
    } else {
      this.apiService.createProduct(this.productForm.value).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error creating product';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
