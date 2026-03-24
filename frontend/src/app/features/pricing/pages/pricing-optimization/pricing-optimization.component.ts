import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ApiService } from '@app/core/services/api.service';

@Component({
  selector: 'app-pricing-optimization',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
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
                  <td>{{ item.selling_price | currency }}</td>
                  <td>{{ item.optimized_price | currency }}</td>
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
      color: #00BCD4;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #B0BEC5;
      font-size: 1.1rem;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .chart-section,
    .table-section {
      background: #363636;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid #424242;
    }

    h2 {
      font-size: 1.5rem;
      color: #00BCD4;
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
      background-color: #2a2a2a;
      color: #00BCD4;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #424242;
      white-space: nowrap;
    }

    .optimization-table td {
      padding: 1rem;
      border-bottom: 1px solid #424242;
      color: #ffffff;
    }

    .optimization-table tr:hover {
      background-color: #2a2a2a;
    }

    .optimization-table tr.increase {
      background-color: rgba(255, 152, 0, 0.1);
    }

    .optimization-table tr.decrease {
      background-color: rgba(76, 175, 80, 0.1);
    }

    .optimization-table tr.maintain {
      background-color: rgba(158, 158, 158, 0.1);
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .badge.increase {
      background-color: #FF9800;
      color: #2a2a2a;
    }

    .badge.decrease {
      background-color: #4CAF50;
      color: white;
    }

    .badge.maintain {
      background-color: #9E9E9E;
      color: white;
    }

    .optimization-table td:nth-child(5) {
      font-weight: 600;
    }

    .optimization-table td:nth-child(5).positive {
      color: #FF9800;
    }

    .optimization-table td:nth-child(5).negative {
      color: #4CAF50;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #B0BEC5;
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
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        borderColor: '#F44336',
        borderWidth: 2
      },
      {
        label: 'Optimized Price',
        data: [],
        backgroundColor: 'rgba(0, 188, 212, 0.5)',
        borderColor: '#00BCD4',
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
        position: 'top',
        labels: {
          color: '#ffffff',
          font: { size: 12 }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#B0BEC5' },
        grid: { color: '#424242' }
      },
      x: {
        ticks: { color: '#B0BEC5' },
        grid: { color: '#424242' }
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
