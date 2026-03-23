# Price Optimization Tool

A comprehensive web application for optimizing product pricing strategies based on demand forecasting and market analysis. Built with Flask, MongoDB, and Angular 20.

## 📋 Project Overview

The Price Optimization Tool enables business users to:
- Manage product inventory with detailed attributes
- Analyze demand patterns and trends
- Receive AI-powered pricing recommendations
- Optimize revenue through dynamic pricing strategies
- Access role-based features (Admin, Supplier, Buyer)

### Business Value
- **Increase Revenue**: Dynamic pricing based on demand
- **Reduce Inventory**: Smart demand forecasting
- **Better Decisions**: Data-driven recommendations
- **Ease of Use**: Intuitive user interface

## 🏗️ Technology Stack

### Backend
- **Framework**: Flask 2.3.2
- **Database**: MongoDB
- **Security**: JWT Authentication, bcrypt password hashing
- **API**: RESTful with CORS support
- **Language**: Python 3.9+

### Frontend
- **Framework**: Angular 20
- **Language**: TypeScript
- **Visualization**: Chart.js, D3.js
- **Styling**: SCSS
- **UI Components**: Standalone Angular components

### Infrastructure
- **Package Manager**: npm (frontend), pip (backend)
- **Version Control**: Git
- **Database**: MongoDB (local or Atlas)

## 📁 Project Structure

```
product-price-optimization-tool/
├── backend/                      # Flask API
│   ├── app.py                   # Main application
│   ├── config.py                # Configuration
│   ├── db.py                    # Database connection
│   ├── auth_utils.py            # Authentication
│   ├── pricing_utils.py         # Pricing algorithms
│   ├── seed_db.py               # Database seeding
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   └── README.md                # Backend documentation
├── frontend/                     # Angular application
│   ├── src/
│   │   ├── app/                 # Application code
│   │   ├── environments/        # Environment configs
│   │   ├── index.html           # HTML entry point
│   │   ├── main.ts              # Bootstrap file
│   │   └── styles.scss          # Global styles
│   ├── package.json             # Node dependencies
│   ├── angular.json             # Angular configuration
│   ├── tsconfig.json            # TypeScript config
│   └── README.md                # Frontend documentation
├── README.md                     # This file
└── .gitignore                    # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+ with pip
- Node.js 18+ with npm
- MongoDB (local or cloud)
- Git

### Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI

# Seed database with mock data
python seed_db.py

# Start Flask server
python app.py
```

Backend runs on: `http://localhost:5000`

### Frontend Setup (5 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure API endpoint (optional - already set to localhost:5000)
# Edit src/environments/environment.ts if needed

# Start Angular development server
npm start
```

Frontend runs on: `http://localhost:4200`

## 🔐 Demo Credentials

After running `python seed_db.py`, use these credentials:

```
Admin:    admin@example.com / admin123
Buyer:    buyer@example.com / buyer123
Supplier: supplier@example.com / supplier123
```

## 📊 Sample Mock Data

10 products are preloaded:
- Eco-Friendly Water Bottle
- Organic Cotton T-Shirt
- Bamboo Toothbrush
- Portable Solar Charger
- Stainless Steel Food Container
- Eco Yoga Mat
- Canvas Shopping Bag
- Bamboo Cutting Board Set
- LED Plant Growth Light
- Natural Soap Collection

## 🎯 Key Features

### 1. Product Management
- Create, read, update, delete products
- Advanced search and filtering
- Category-based organization
- Detailed product attributes

### 2. Demand Forecasting
- Calculate demand based on historical data
- Visualize trends with interactive charts
- Support for seasonal variations
- Rating and inventory factors

### 3. Pricing Optimization
- Dynamic pricing recommendations
- Profit margin optimization
- Stock level considerations
- Price change indicators

### 4. User Management
- User registration and login
- Three role types: Admin, Supplier, Buyer
- Password security with bcrypt
- JWT-based token authentication

### 5. Dashboard
- Real-time statistics
- Revenue calculations
- Stock monitoring
- Quick navigation

## 🔄 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
```

### Products
```
GET    /api/products
GET    /api/products/<id>
POST   /api/products
PUT    /api/products/<id>
DELETE /api/products/<id>
GET    /api/categories
GET    /api/products/search
```

### Forecasting & Optimization
```
GET    /api/products/<id>/forecast
GET    /api/products/forecasts/all
GET    /api/products/<id>/optimize-price
GET    /api/pricing-optimization/all
```

### Health
```
GET    /api/health
```

## 📈 Algorithms

### Demand Forecast Formula
```
forecast = (units_sold * customer_rating / 5) * stock_factor
stock_factor = min(1.5, stock_available / 100)
```

### Price Optimization Strategy
1. Calculate demand intensity and stock intensity
2. Apply dynamic multiplier based on conditions:
   - High demand + Low stock: +15%
   - Moderate demand: +5% to -5%
   - Low demand + High stock: -15%
3. Ensure minimum margin of 10% above cost

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Environment variable protection
- CORS configuration
- Input validation and sanitization

## 📚 Documentation

- **Backend**: See [backend/README.md](backend/README.md)
- **Frontend**: See [frontend/README.md](frontend/README.md)

## 📧 Support

For issues or questions, contact: support@price-optimization.com

## 📄 License

MIT License - See LICENSE file for details

---

**Version**: 1.0.0  
**Status**: Production Ready ✨
