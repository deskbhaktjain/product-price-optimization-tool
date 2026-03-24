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

    .forecast-table {
      width: 100%;
      border-collapse: collapse;
    }

    .forecast-table th {
      background-color: #2a2a2a;
      color: #00BCD4;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #424242;
      white-space: nowrap;
    }

    .forecast-table td {
      padding: 1rem;
      border-bottom: 1px solid #424242;
      color: #ffffff;
    }

    .forecast-table tr:hover {
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

    .forecast-value {
      background-color: rgba(76, 175, 80, 0.3);
      color: #4CAF50;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
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

      .forecast-table th,
      .forecast-table td {
        padding: 0.75rem 0.5rem;
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
