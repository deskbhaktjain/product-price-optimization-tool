# Price Optimization Tool - Backend API

RESTful API built with Flask and MongoDB for the Price Optimization Tool. Provides endpoints for product management, demand forecasting, and pricing optimization.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Full CRUD operations for products
- **Demand Forecasting**: Calculate demand forecasts based on historical data
- **Pricing Optimization**: Dynamic pricing recommendations
- **Search & Filtering**: Advanced search and category filtering
- **Role-Based Access Control**: Support for Admin, Supplier, and Buyer roles

## 📋 Prerequisites

- Python 3.9+
- MongoDB (local or Atlas)
- pip or Poetry for dependency management

## 🔧 Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and update:
```
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/price_optimization
JWT_SECRET=your-secret-key
SECRET_KEY=your-app-secret-key
```

### 3. Seed Database with Mock Data

```bash
python seed_db.py
```

This will populate the database with:
- 10 sample products
- 3 test users (admin, buyer, supplier)

**Test Credentials:**
- Admin: `admin@example.com` / `admin123`
- Buyer: `buyer@example.com` / `buyer123`
- Supplier: `supplier@example.com` / `supplier123`

### 4. Start the Flask Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/<id>` - Get product by ID
- `POST /api/products` - Create product (admin/supplier)
- `PUT /api/products/<id>` - Update product (admin/supplier)
- `DELETE /api/products/<id>` - Delete product (admin)
- `GET /api/products/search` - Search products
- `GET /api/categories` - Get all categories

### Demand Forecasting
- `GET /api/products/<id>/forecast` - Get forecast for product
- `GET /api/products/forecasts/all` - Get all forecasts

### Pricing Optimization
- `GET /api/products/<id>/optimize-price` - Get optimized price
- `GET /api/pricing-optimization/all` - Get all optimized prices

### Health Check
- `GET /api/health` - Check API status

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## 📊 Database Schema

### Products Collection
```json
{
  "product_id": 1,
  "name": "Product Name",
  "description": "Product description",
  "cost_price": 10.00,
  "selling_price": 25.00,
  "category": "Electronics",
  "stock_available": 500,
  "units_sold": 200,
  "customer_rating": 4.5,
  "demand_forecast": 250,
  "optimized_price": 24.50,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Users Collection
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashed_password",
  "role": "admin|supplier|buyer",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 🧮 Pricing Algorithm

The pricing optimization uses a dynamic strategy based on:
1. **Demand Intensity**: (forecast_demand / historical_sales)
2. **Stock Intensity**: Inverse relationship with inventory levels
3. **Margin Optimization**: Balancing profit and competitiveness

**Logic:**
- High demand + Low stock → Increase price (up to 15%)
- Low demand + High stock → Decrease price (down to 15%)
- Moderate conditions → Maintain near-optimal price

## 📈 Demand Forecast Formula

```
forecast = (units_sold * customer_rating / 5) * stock_factor
```

Where:
- `stock_factor` = min(1.5, stock_available / 100)

## 🛠️ Development

### Run in Development Mode
```bash
export FLASK_ENV=development
python app.py
```

### Run Tests
```bash
pytest tests/
```

### Format Code
```bash
black . --line-length 88
```

## 📦 Project Structure

```
backend/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── db.py                     # Database connection
├── auth_utils.py             # Authentication utilities
├── pricing_utils.py          # Pricing algorithms
├── seed_db.py                # Database seeding script
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🚨 Error Handling

All endpoints return JSON responses with standard format:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

Or for errors:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔄 CORS

CORS is enabled for all origins. Update `CORS(app)` in `app.py` for production.

## 📝 Logging

Add logging configuration in production:
```python
import logging
logging.basicConfig(filename='app.log', level=logging.INFO)
```

## 🚀 Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## 📧 Support

For issues or questions, contact: support@priceoptstool.com

## 📄 License

MIT License - See LICENSE file for details
