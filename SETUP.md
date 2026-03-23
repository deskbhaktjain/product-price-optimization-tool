# Setup & Installation Guide

Complete step-by-step guide to set up and run the Price Optimization Tool locally.

## 🔧 Prerequisites

Before starting, ensure you have:

- **Python 3.9+** - Download from [python.org](https://www.python.org/downloads/)
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **MongoDB** - Either [local installation](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **Code Editor** - VS Code recommended

Verify installations:
```bash
python --version    # Should be 3.9+
node --version      # Should be 18+
npm --version       # Should be 8+
git --version       # Any recent version
```

## 📦 Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment (Optional but Recommended)

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

Wait for installation to complete (this may take a few minutes).

### Step 4: Configure Environment Variables

Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` file with your MongoDB connection string:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/price_optimization
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/price_optimization
```

Other environment variables:
```
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET=your-jwt-secret-change-in-production
```

### Step 5: Seed Database with Mock Data

```bash
python seed_db.py
```

Expected output:
```
✓ Inserted 10 products
✓ Inserted 3 users
✓ Indexes created
✅ Database seeding completed successfully!

📝 Test Credentials:
   Admin       - admin@example.com / admin123
   Buyer       - buyer@example.com / buyer123
   Supplier    - supplier@example.com / supplier123
```

### Step 6: Start Flask Server

```bash
python app.py
```

Expected output:
```
* Running on http://127.0.0.1:5000
```

✅ Backend is now running! Test it:
```bash
# In a new terminal, test the health endpoint
curl http://localhost:5000/api/health
```

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal** (keep backend running) and:
```bash
cd frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

This will install all required packages (Angular, Chart.js, etc.). Wait for installation to complete.

### Step 3: Verify API Configuration

Check `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

If your backend is on a different address, update it here.

### Step 4: Start Angular Development Server

```bash
npm start
```

Or if that doesn't work:
```bash
ng serve --open
```

Expected output:
```
✔ Compiled successfully.

Application bundle generated successfully
The development server is listening on http://localhost:4200
```

The browser should automatically open to `http://localhost:4200`

✅ Frontend is now running!

## 🚀 First Run - What to Do

### 1. Login to the Application
- Navigate to `http://localhost:4200`
- Click "Sign In"
- Use credentials:
  ```
  Email: admin@example.com
  Password: admin123
  ```

### 2. Explore the Dashboard
- View product statistics
- Check total revenue and ratings
- Navigate using the top menu

### 3. View Products
- Click "Products" → See all products from sample data
- Use search to find products
- Filter by category

### 4. Check Demand Forecast
- Click "Demand Forecast"
- View the chart comparing units sold vs demand
- See detailed forecast table

### 5. Review Pricing Optimization
- Click "Pricing Optimization"
- See price comparison chart
- Review optimization recommendations
- Check if prices should increase/decrease

## 📝 Common Tasks

### Add a New Product (as Admin)
1. Login as admin
2. Click "Products" → "+ Add New Product"
3. Fill in product details:
   - Name
   - Category
   - Cost Price & Selling Price
   - Stock Available
4. Click "Create Product"

### Edit a Product
1. Go to Products
2. Find product → Click edit icon (✏️)
3. Modify details
4. Save changes

### View Product Details
1. Go to Products
2. Click product name or view icon (👁️)
3. See all product information
4. View profit metrics

### Generate Pricing Recommendations
1. Click "Pricing Optimization"
2. View all products with:
   - Current price
   - Optimized price
   - Percentage change
   - Recommendation (Increase/Decrease/Maintain)

## 🔍 API Testing

Test backend endpoints using curl or Postman:

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Get All Products
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with token from login response.

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "Cannot find module 'flask'"**
```bash
# Solutions:
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**Error: "Connection refused" to MongoDB**
```bash
# Ensure MongoDB is running
# For local: mongod should be running
# For Atlas: Check connection string in .env
```

**Port 5000 already in use**
```bash
# Kill the process using port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Frontend Won't Start

**Error: "command not found: ng"**
```bash
npm install -g @angular/cli@20
```

**Port 4200 already in use**
```bash
npm start -- --port 4300
```

**CORS error in browser console**
- Check backend is running on port 5000
- Verify apiUrl in environment.ts
- Ensure CORS is enabled in Flask

**Module not found errors**
```bash
rm -rf node_modules
npm install
```

### Login Issues

**Invalid credentials**
- Ensure database was seeded with `python seed_db.py`
- Check credentials: admin@example.com / admin123

**Token expired**
- Tokens expire after 24 hours
- Login again to get new token

## 📱 Access Different Roles

Switch between user roles to test different features:

### Admin Access
```
Email: admin@example.com
Password: admin123
Can: Create/Edit/Delete products, all features
```

### Supplier Access
```
Email: supplier@example.com
Password: supplier123
Can: Create/Edit products, view forecasts, view pricing
```

### Buyer Access
```
Email: buyer@example.com
Password: buyer123
Can: View products, search, view forecasts, view pricing
```

## 🔄 Development Mode

### Backend Development
- Changes to Python files require server restart
- Use `python app.py` to restart

### Frontend Development
- Angular development server auto-reloads on file changes
- Open browser console (F12) to check for errors

## 🚀 Next Steps

1. **Customize Mock Data**: Edit `backend/seed_db.py` to add your products
2. **Modify Pricing Algorithm**: Edit `backend/pricing_utils.py`
3. **Update UI Design**: Modify styles in `frontend/src/styles.scss`
4. **Add Features**: Create new components or API endpoints

## 📚 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Angular Documentation](https://angular.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

## ✅ Verification Checklist

Before considering setup complete:

- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:4200
- ✅ Can login with admin credentials
- ✅ Dashboard shows product statistics
- ✅ Can view products list
- ✅ Can see demand forecast chart
- ✅ Can view pricing optimization recommendations
- ✅ Search and filter work
- ✅ Can create new product (as admin)

## 🆘 Still Having Issues?

1. Check the [backend README](backend/README.md)
2. Check the [frontend README](frontend/README.md)
3. Review error messages carefully
4. Search error messages on Stack Overflow
5. Contact support@price-optimization.com

---

**Congratulations! 🎉** Your Price Optimization Tool is now set up and running!
