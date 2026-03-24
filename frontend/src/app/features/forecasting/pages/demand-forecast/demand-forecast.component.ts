import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, Chart } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ApiService } from '@app/core/services/api.service';

@Component({
  selector: 'app-demand-forecast',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="demand-forecast-container">
      <div class="header">
        <h1>Demand Forecast Analysis</h1>
        <p>Visualize product demand trends and forecasts</p>
      </div>

      <div class="content">
        <div class="chart-section">
          <h2>Product Demand Forecast</h2>
          <canvas baseChart [data]="chartData" [options]="chartOptions"></canvas>
        </div>

        <div class="table-section">
          <h2>Demand Forecast Details</h2>
          <div class="table-container">
            <table class="forecast-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Selling Price</th>
                  <th>Units Sold</th>
                  <th>Stock Available</th>
                  <th>Customer Rating</th>
                  <th>Demand Forecast</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of forecasts">
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.selling_price }}</td>
                  <td>{{ item.units_sold }}</td>
                  <td>{{ item.stock_available }}</td>
                  <td>
                    <span class="rating">{{ item.customer_rating }}/5</span>
                  </td>
                  <td>
                    <span class="forecast-value">{{ item.demand_forecast }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        Loading demand forecasts...
      </div>
    </div>
  `,
  styles: [`
    .demand-forecast-container {
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
      padding: var(--spacing-2xl);
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
      margin-bottom: var(--spacing-2xl);
    }

    .chart-section canvas {
      max-height: 500px;
      margin: var(--spacing-lg) 0;
    }

    .table-container {
      overflow: auto;
      border-radius: var(--radius-md);
    }

    .forecast-table {
      width: 100%;
      border-collapse: collapse;
    }

    .forecast-table th {
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

    .forecast-table td {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .forecast-table tbody tr {
      transition: all var(--transition-base);
    }

    .forecast-table tbody tr:hover {
      background: rgba(0, 188, 212, 0.05);
      border-bottom-color: rgba(0, 188, 212, 0.3);
    }

    .forecast-table tbody tr:last-child td {
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

    .forecast-value {
      background: rgba(76, 175, 80, 0.15);
      color: #66BB6A;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-sm);
      font-weight: var(--font-semibold);
      display: inline-block;
      border: 1px solid rgba(76, 175, 80, 0.3);
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

      .forecast-table th,
      .forecast-table td {
        padding: var(--spacing-md);
        font-size: 0.9rem;
      }
    }
  `]
})
export class DemandForecastComponent implements OnInit {
  private apiService = inject(ApiService);

  forecasts: any[] = [];
  loading = true;

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Units Sold',
        data: [],
        backgroundColor: 'rgba(0, 188, 212, 0.5)',
        borderColor: '#00BCD4',
        borderWidth: 2
      },
      {
        label: 'Demand Forecast',
        data: [],
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        borderColor: '#4CAF50',
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
    this.loadForecasts();
  }

  loadForecasts(): void {
    this.apiService.getAllForecasts().subscribe({
      next: (response) => {
        if (response.success) {
          this.forecasts = response.data;
          this.updateChart();
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading forecasts:', error);
        this.loading = false;
      }
    });
  }

  private updateChart(): void {
    const labels = this.forecasts.map((f) => f.product_name.substring(0, 15));
    const unitsSold = this.forecasts.map((f) => f.units_sold);
    const forecast = this.forecasts.map((f) => f.demand_forecast);

    this.chartData!.labels = labels;
    this.chartData!.datasets![0].data = unitsSold;
    this.chartData!.datasets![1].data = forecast;
  }
}
