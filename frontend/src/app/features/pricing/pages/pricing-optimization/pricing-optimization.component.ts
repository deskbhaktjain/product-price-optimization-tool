import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '@app/core/services/api.service';

@Component({
  selector: 'app-pricing-optimization',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="pricing-container">
      <div class="header">
        <h1>Pricing Optimization</h1>
        <p>Optimized pricing recommendations based on market analysis</p>
      </div>

      <div class="content">
        <div class="chart-section">
          <h2>Price Comparison Chart</h2>
          <canvas baseChart [data]="priceChartData" [options]="chartOptions"></canvas>
        </div>

        <div class="table-section">
          <h2>Pricing Recommendations</h2>
          <div class="table-container">
            <table class="optimization-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Price</th>
                  <th>Optimized Price</th>
                  <th>Change %</th>
                  <th>Recommendation</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of optimizations" [ngClass]="getRecommendationClass(item.recommendation)">
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.category }}</td>
                  <td>${{ item.selling_price }}</td>
                  <td>${{ item.optimized_price }}</td>
                  <td [ngClass]="getChangeClass(item.price_change_percent)">
                    {{ item.price_change_percent > 0 ? '+' : '' }}{{ item.price_change_percent }}%
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getRecommendationBadgeClass(item.recommendation)">
                      {{ item.recommendation }}
                    </span>
                  </td>
                  <td>{{ item.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        Loading pricing optimizations...
      </div>
    </div>
  `,
  styles: [`
    .pricing-container {
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

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .chart-section,
    .table-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .chart-section canvas {
      max-height: 400px;
    }

    .table-container {
      overflow-x: auto;
    }

    .optimization-table {
      width: 100%;
      border-collapse: collapse;
    }

    .optimization-table th {
      background-color: #f8f9fa;
      color: #2c3e50;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
      white-space: nowrap;
    }

    .optimization-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .optimization-table tr:hover {
      background-color: #f8f9fa;
    }

    .optimization-table tr.increase {
      background-color: #fef5e7;
    }

    .optimization-table tr.decrease {
      background-color: #d5f4e6;
    }

    .optimization-table tr.maintain {
      background-color: #f0f3f4;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .badge.increase {
      background-color: #f39c12;
      color: white;
    }

    .badge.decrease {
      background-color: #27ae60;
      color: white;
    }

    .badge.maintain {
      background-color: #95a5a6;
      color: white;
    }

    .optimization-table td:nth-child(5) {
      font-weight: 600;
    }

    .optimization-table td:nth-child(5).positive {
      color: #f39c12;
    }

    .optimization-table td:nth-child(5).negative {
      color: #27ae60;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 1.5rem;
      }

      .chart-section,
      .table-section {
        padding: 1rem;
      }

      .optimization-table th,
      .optimization-table td {
        padding: 0.75rem 0.5rem;
        font-size: 0.85rem;
      }

      .badge {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
      }
    }
  `]
})
export class PricingOptimizationComponent implements OnInit {
  private apiService = inject(ApiService);

  optimizations: any[] = [];
  loading = true;

  priceChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Current Price',
        data: [],
        backgroundColor: 'rgba(231, 76, 60, 0.5)',
        borderColor: '#e74c3c',
        borderWidth: 2
      },
      {
        label: 'Optimized Price',
        data: [],
        backgroundColor: 'rgba(39, 174, 96, 0.5)',
        borderColor: '#27ae60',
        borderWidth: 2
      }
    ]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  ngOnInit(): void {
    this.loadOptimizations();
  }

  loadOptimizations(): void {
    this.apiService.getAllOptimizedPrices().subscribe({
      next: (response) => {
        if (response.success) {
          this.optimizations = response.data;
          this.updateChart();
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading optimizations:', error);
        this.loading = false;
      }
    });
  }

  private updateChart(): void {
    const labels = this.optimizations.map((o) =>
      o.product_name.substring(0, 15)
    );
    const currentPrices = this.optimizations.map((o) => o.selling_price);
    const optimizedPrices = this.optimizations.map((o) => o.optimized_price);

    this.priceChartData!.labels = labels;
    this.priceChartData!.datasets![0].data = currentPrices;
    this.priceChartData!.datasets![1].data = optimizedPrices;
  }

  getRecommendationClass(recommendation: string): string {
    if (recommendation === 'Increase price') return 'increase';
    if (recommendation === 'Decrease price') return 'decrease';
    return 'maintain';
  }

  getRecommendationBadgeClass(recommendation: string): string {
    if (recommendation === 'Increase price') return 'increase';
    if (recommendation === 'Decrease price') return 'decrease';
    return 'maintain';
  }

  getChangeClass(change: number): string {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return '';
  }
}
