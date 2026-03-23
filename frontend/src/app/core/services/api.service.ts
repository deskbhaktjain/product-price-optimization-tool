import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ============ HEALTH CHECK ============
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  // ============ AUTHENTICATION ============
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  // ============ PRODUCTS ============
  getProducts(page: number = 1, limit: number = 10, search?: string, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);

    return this.http.get(`${this.apiUrl}/products`, { params });
  }

  getProduct(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${productId}`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, data);
  }

  updateProduct(productId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${productId}`, data);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${productId}`);
  }

  searchProducts(query: string, category?: string): Observable<any> {
    let params = new HttpParams().set('q', query);
    if (category) params = params.set('category', category);
    return this.http.get(`${this.apiUrl}/products/search`, { params });
  }

  // ============ FORECASTING ============
  getDemandForecast(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${productId}/forecast`);
  }

  getAllForecasts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/forecasts/all`);
  }

  // ============ PRICING OPTIMIZATION ============
  optimizePrice(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${productId}/optimize-price`);
  }

  getAllOptimizedPrices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pricing-optimization/all`);
  }

  // ============ CATEGORIES ============
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }
}
