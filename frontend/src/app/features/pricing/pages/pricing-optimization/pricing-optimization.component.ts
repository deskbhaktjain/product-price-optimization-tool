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
          <div class="chart-header">
            <h2>Price Comparison Chart</h2>
            <div class="chart-toggle">
              <button 
                (click)="toggleChartType('bar')" 
                [class.active]="chartType === 'bar'"
                class="toggle-btn">
                <i class="fas fa-chart-bar"></i> Bar Chart
              </button>
              <button 
                (click)="toggleChartType('line')" 
                [class.active]="chartType === 'line'"
                class="toggle-btn">
                <i class="fas fa-chart-line"></i> Line Chart
              </button>
            </div>
          </div>
          <canvas baseChart [data]="priceChartData" [options]="chartOptions" [type]="chartType"></canvas>
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

    .header {
      margin-bottom: var(--spacing-3xl);
      animation: slideInUp 0.5s ease-out 0.1s both;
    }

    .header h1 {
      font-size: var(--font-3xl);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-sm);
    }

    .header p {
      color: var(--text-tertiary);
      font-size: var(--font-lg);
      font-weight: var(--font-medium);
    }

    .content {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-2xl);
    }

    .chart-section,
    .table-section {
      background: var(--card-background);
      padding: var(--spacing-lg) var(--spacing-xl);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
      animation: slideInUp 0.5s ease-out;
    }

    .chart-section {
      animation-delay: 0.1s;
    }

    .table-section {
      animation-delay: 0.2s;
    }

    h2 {
      font-size: var(--font-2xl);
      background: linear-gradient(135deg, #26E0E0 0%, #00BCD4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: var(--spacing-lg);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .chart-toggle {
      display: flex;
      gap: var(--spacing-sm);
      background: rgba(0, 188, 212, 0.08);
      padding: 0.4rem;
      border-radius: var(--radius-md);
      border: 1px solid rgba(0, 188, 212, 0.2);
    }

    .toggle-btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-base);
      border-radius: var(--radius-sm);
      font-weight: var(--font-semibold);
      font-size: var(--font-sm);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .toggle-btn i {
      font-size: 1.1rem;
    }

    .toggle-btn.active {
      background: linear-gradient(135deg, #00BCD4, #26E0E0);
      color: #1a1a1a;
      box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);
    }

    .toggle-btn:hover:not(.active) {
      background: rgba(0, 188, 212, 0.1);
      color: #26E0E0;
    }

    .chart-section canvas {
      max-height: 320px;
      margin: var(--spacing-md) 0;
    }

    .table-container {
      overflow: auto;
      border-radius: var(--radius-md);
    }

    .optimization-table {
      width: 100%;
      border-collapse: collapse;
    }

    .optimization-table th {
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

    .optimization-table td {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .optimization-table tbody tr {
      transition: all var(--transition-base);
    }

    .optimization-table tbody tr:hover {
      background: rgba(0, 188, 212, 0.05);
      border-bottom-color: rgba(0, 188, 212, 0.3);
    }

    .optimization-table tbody tr:last-child td {
      border-bottom: none;
    }

    .optimization-table tr.increase {
      background: rgba(255, 152, 0, 0.08);
    }

    .optimization-table tr.decrease {
      background: rgba(76, 175, 80, 0.08);
    }

    .optimization-table tr.maintain {
      background: rgba(156, 156, 156, 0.05);
    }

    .badge {
      display: inline-block;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-sm);
      font-weight: var(--font-semibold);
      font-size: var(--font-sm);
      text-transform: capitalize;
    }

    .badge.increase {
      background: linear-gradient(135deg, #FF9800, #FFB74D);
      color: #1a1a1a;
    }

    .badge.decrease {
      background: linear-gradient(135deg, #4CAF50, #66BB6A);
      color: white;
    }

    .badge.maintain {
      background: rgba(156, 156, 156, 0.3);
      color: var(--text-secondary);
      border: 1px solid rgba(156, 156, 156, 0.5);
    }

    .optimization-table td:nth-child(5) {
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .optimization-table td:nth-child(5).positive {
      color: #FFB74D;
    }

    .optimization-table td:nth-child(5).negative {
      color: #66BB6A;
    }

    .loading {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--text-tertiary);
      font-size: var(--font-base);
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: var(--font-2xl);
      }

      .chart-section,
      .table-section {
        padding: var(--spacing-lg);
      }

      .optimization-table th,
      .optimization-table td {
        padding: var(--spacing-md);
        font-size: 0.9rem;
      }

      .badge {
        font-size: 0.8rem;
        padding: 0.4rem 0.6rem;
      }
    }
  `]
})
export class PricingOptimizationComponent implements OnInit {
  private apiService = inject(ApiService);

  optimizations: any[] = [];
  loading = true;
  chartType: 'bar' | 'line' = 'bar';

  priceChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Current Price',
        data: [],
        backgroundColor: 'rgba(255, 107, 107, 0.6)',
        borderColor: '#FF6B6B',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#FF6B6B',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#E53935'
      },
      {
        label: 'Optimized Price',
        data: [],
        backgroundColor: 'rgba(102, 187, 255, 0.6)',
        borderColor: '#2196F3',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#1976D2'
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
          color: '#E0E0E0',
          font: { size: 11, weight: 600, family: "'Inter', sans-serif" },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8
        }
      },
      title: {
        display: false
      },
      filler: {
        propagate: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#9E9E9E', font: { size: 10 }, maxTicksLimit: 5 },
        grid: { color: 'rgba(255, 255, 255, 0.05)', display: true }
      },
      x: {
        ticks: { color: '#9E9E9E', font: { size: 10 } },
        grid: { color: 'transparent', display: false }
      }
    }
  };

  ngOnInit(): void {
    this.loadOptimizations();
  }

  toggleChartType(type: 'bar' | 'line'): void {
    this.chartType = type;
    this.updateChartForType();
  }

  loadOptimizations(): void {
    this.apiService.getAllOptimizedPrices().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.optimizations = response.data;
          this.updateChart();
          this.loading = false;
        }
      },
      error: (error: any) => {
        console.error('Error loading optimizations:', error);
        this.loading = false;
      }
    });
  }

  private updateChartForType(): void {
    if (this.chartType === 'bar') {
      (this.priceChartData!.datasets![0] as any).backgroundColor = 'rgba(255, 107, 107, 0.6)';
      (this.priceChartData!.datasets![1] as any).backgroundColor = 'rgba(102, 187, 255, 0.6)';
      (this.priceChartData!.datasets![0] as any).fill = true;
      (this.priceChartData!.datasets![1] as any).fill = true;
    } else {
      (this.priceChartData!.datasets![0] as any).backgroundColor = 'transparent';
      (this.priceChartData!.datasets![1] as any).backgroundColor = 'transparent';
      (this.priceChartData!.datasets![0] as any).fill = false;
      (this.priceChartData!.datasets![1] as any).fill = false;
    }
  }

  private updateChart(): void {
    const labels = this.optimizations.map((o) => o.product_name.substring(0, 15));
    const currentPrice = this.optimizations.map((o) => o.selling_price);
    const optimizedPrice = this.optimizations.map((o) => o.optimized_price);

    this.priceChartData!.labels = labels;
    this.priceChartData!.datasets![0].data = currentPrice;
    this.priceChartData!.datasets![1].data = optimizedPrice;
    
    this.updateChartForType();
    
    // Trigger change detection by reassigning the object
    this.priceChartData = { ...this.priceChartData };
  }

  getRecommendationClass(recommendation: string): string {
    return recommendation.toLowerCase();
  }

  getRecommendationBadgeClass(recommendation: string): string {
    return recommendation.toLowerCase();
  }

  getChangeClass(change: number): string {
    return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  }
}
