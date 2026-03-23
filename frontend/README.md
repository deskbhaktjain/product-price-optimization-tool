# Price Optimization Tool - Frontend

Modern responsive web application built with Angular 20 for the Price Optimization Tool. Features product management, demand forecasting, and pricing optimization with interactive visualizations.

## 🚀 Features

- **User Authentication**: Login/Register with JWT
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Product Management**: Create, read, update, delete products
- **Demand Forecasting**: Visualize demand trends with Chart.js
- **Pricing Optimization**: Interactive pricing recommendations
- **Real-time Search**: Search and filter products by category
- **Role-Based Access**: Different features for Admin, Supplier, Buyer roles
- **Intuitive UI**: Clean, modern interface matching PDF design

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Angular CLI 20
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install
```

Or with Yarn:
```bash
yarn install
```

### 2. Configure API URL

Update API endpoint in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### 3. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:4200`

## 🎨 Project Structure

```
frontend/src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   └── services/        # API and Auth services
│   ├── features/
│   │   ├── auth/            # Login/Register pages
│   │   ├── dashboard/       # Dashboard layout
│   │   ├── products/        # Product management
│   │   ├── forecasting/     # Demand forecast
│   │   └── pricing/         # Pricing optimization
│   ├── shared/
│   │   └── pages/          # Shared pages (unauthorized)
│   ├── app.component.ts     # Main app component
│   └── app.routes.ts        # Routing configuration
├── environments/            # Environment configs
├── styles.scss             # Global styles
├── index.html              # HTML entry point
└── main.ts                 # Angular bootstrap
```

## 🔐 Authentication

The app uses JWT tokens for authentication. Login credentials are stored in localStorage.

**Demo Credentials:**
- Admin: `admin@example.com` / `admin123`
- Buyer: `buyer@example.com` / `buyer123`
- Supplier: `supplier@example.com` / `supplier123`

## 📊 Key Components

### Dashboard
Displays overview statistics:
- Total products count
- Total revenue
- Average customer rating
- Total stock available

### Product Management
- View all products with pagination
- Search by name/description
- Filter by category
- Create new products (admin/supplier only)
- Edit product details
- Delete products (admin only)
- View product details

### Demand Forecast
- Bar chart comparing units sold vs demand forecast
- Table with detailed forecast data by product
- Customer ratings and stock levels visualization

### Pricing Optimization
- Comparison chart: current price vs optimized price
- Pricing recommendations table
- Color-coded recommendations (increase/decrease/maintain)
- Percentage change indicators

## 🏗️ Services

### ApiService
Handles all API calls to the backend:
```typescript
// Products
getProducts(page, limit, search?, category?)
getProduct(id)
createProduct(data)
updateProduct(id, data)
deleteProduct(id)

// Forecasting
getDemandForecast(productId)
getAllForecasts()

// Pricing
optimizePrice(productId)
getAllOptimizedPrices()
```

### AuthService
Manages authentication state:
```typescript
login(email, password)
register(name, email, password, role)
logout()
isAuthenticated()
getCurrentUser()
hasRole(role)
```

## 🎨 Styling

Global styles are in `src/styles.scss`. Uses:
- **Colors**: Primary (#667eea), Success (#27ae60), Danger (#e74c3c), etc.
- **Responsive Grid**: Mobile-first design approach
- **CSS Variables**: Easy customization of theme colors
- **Animations**: Smooth transitions and interactions

## 📦 Built With

- **Angular 20**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Chart.js & ng2-charts**: Data visualization
- **RxJS**: Reactive programming
- **Angular Forms**: Form management (Reactive & Template)
- **Angular Router**: Routing and navigation
- **SCSS**: Styling and preprocessing

## 🚀 Build for Production

### Build Optimized Bundle

```bash
npm run build:prod
```

Output will be in `dist/price-optimization-frontend/`

### Deploy to Static Server

```bash
npm run build:prod
# Upload dist/ folder to your web server
```

## 🔄 Development Workflow

### Run with Live Reload
```bash
ng serve --open
```

### Run Tests
```bash
ng test
```

### Run e2e Tests
```bash
ng e2e
```

### Lint Code
```bash
ng lint
```

## 🎯 Features by Role

### Admin
- ✅ View all products
- ✅ Create products
- ✅ Edit all products
- ✅ Delete products
- ✅ View forecasts
- ✅ View pricing optimization

### Supplier
- ✅ View all products
- ✅ Create products
- ✅ Edit own products
- ✅ View forecasts
- ✅ View pricing optimization

### Buyer
- ✅ View all products
- ✅ Search products
- ✅ Filter by category
- ✅ View product details
- ✅ View forecasts
- ✅ View pricing optimization

## 🌐 API Integration

The frontend communicates with the Flask backend at `/api` endpoints. 

Example API calls:
```typescript
// Get all products
GET /api/products?page=1&limit=10&search=keyword&category=Electronics

// Get demand forecast
GET /api/products/forecasts/all

// Get pricing optimization
GET /api/pricing-optimization/all
```

## 📱 Responsive Breakpoints

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🔧 Configuration

### Environment Variables

**Development** (`environment.ts`):
```typescript
apiUrl: 'http://localhost:5000/api'
```

**Production** (`environment.prod.ts`):
```typescript
apiUrl: 'https://api.price-optimization.com/api'
```

## 🐛 Troubleshooting

### CORS Issues
Ensure backend CORS is configured properly or proxy requests:
```bash
ng serve --proxy-config proxy.conf.json
```

### Module Not Found
```bash
npm install
ng serve
```

### Build Errors
Clear cache and rebuild:
```bash
rm -rf dist/
rm -rf .angular/
npm install
ng build
```

## 📈 Performance Optimization

- Lazy loading of feature modules
- HTTP interceptors for efficient API calls
- OnPush change detection where possible
- Tree-shaking enabled for production builds

## 🔒 Security

- JWT token-based authentication
- Role-based access control via guards
- HTTPS recommended for production
- XSS and CSRF protection via Angular
- Input sanitization for HTML content

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📧 Support

For issues or questions, contact: support@priceoptstool.com

## 📄 License

MIT License - See LICENSE file for details
