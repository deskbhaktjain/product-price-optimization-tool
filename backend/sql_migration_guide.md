# 🔄 SQL Migration Guide: Moving from MongoDB to PostgreSQL via SQLAlchemy

This guide outlines the step-by-step process of migrating the Price Optimization Tool's backend from a NoSQL database (MongoDB) to a Relational Database (PostgreSQL) using **Flask-SQLAlchemy** and **Flask-Migrate** (Alembic) on a Windows machine.

## Prerequisites for Windows

1. **Install PostgreSQL:**
   * Download the Windows installer from the [official PostgreSQL EnterpriseDB page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
   * Run the installer. Remember the **password** you set for the default `postgres` superuser.
   * After installation, open **pgAdmin 4** (the UI tool installed alongside PostgreSQL) and create a new database named `price_optimization_db`.

2. **Install Required Python Packages:**
   Open your Command Prompt (CMD) or PowerShell, navigate to your `backend` folder, and run:
   ```bash
   pip install Flask-SQLAlchemy Flask-Migrate psycopg2-binary
   ```
   *(Note: `psycopg2-binary` is the PostgreSQL adapter for Python).*

## Step 1: Update Configuration ([backend/config.py](file:///c:/Users/priya/Documents/bcg%20xx/price%20optimization%20app/product-price-optimization-tool/backend/config.py))

You will need to replace your MongoDB connection string with the PostgreSQL URI.

```python
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    
    # PostgreSQL URI Format: postgresql://username:password@localhost:5432/database_name
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'postgresql://postgres:YOUR_PASSWORD@localhost:5432/price_optimization_db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

## Step 2: Initialize SQLAlchemy in [backend/app.py](file:///c:/Users/priya/Documents/bcg%20xx/price%20optimization%20app/product-price-optimization-tool/backend/app.py)

Remove the `pymongo` setup and initialize SQLAlchemy and the Migration engine.

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

app = Flask(__name__)
# Load the configuration with the SQLALCHEMY_DATABASE_URI
app.config.from_object(Config)

# Initialize Database ORM and Migration engine
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models (Make sure to import models AFTER db initialization)
from models import User, Product
```

## Step 3: Define Relational Models (`backend/models.py`)

In MongoDB, we used flexible, unstructured JSON documents. In SQL, we must define strict tables with specific column types. Create a new file called `models.py`:

```python
from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='buyer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)
    cost_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    stock_available = db.Column(db.Integer, default=0)
    units_sold = db.Column(db.Integer, default=0)
    customer_rating = db.Column(db.Float, default=4.0)
    demand_forecast = db.Column(db.Float, default=0.0)
    optimized_price = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## Step 4: Execute Database Migrations (Windows CLI)

Now that we have explicitly mapped out our Python classes to SQL tables, we use `Flask-Migrate` (which runs Alembic under the hood) to actually create those tables in PostgreSQL.
Run these commands in your Windows terminal (inside the `backend` directory):

```bash
# 1. Initialize the migration environment (This creates a 'migrations' folder in your backend)
flask db init

# 2. Generate the actual migration script based on your models.py file
flask db migrate -m "Initial schema for Users and Products"

# 3. Apply the migration to the PostgreSQL database (This physically creates the tables)
flask db upgrade
```

## Step 5: Refactoring API Logic (Example)

You will need to update your API endpoints in [app.py](file:///c:/Users/priya/Documents/bcg%20xx/price%20optimization%20app/product-price-optimization-tool/backend/app.py) to stop using raw PyMongo queries (like `db['products'].insert_one()`) and start using SQLAlchemy ORM (Object-Relational Mapping).

**Old MongoDB Way:**
```python
# Fetching products
products = list(db['products'].find())

# Inserting a product
db['products'].insert_one({'name': 'Example', 'price': 100})
```

**New SQLAlchemy Way:**
```python
@app.route('/api/products', methods=['GET'])
def get_products():
    # 1. Fetch all products using ORM
    products = Product.query.all()
    
    # 2. Serialize the data to return as JSON
    result = [{
        'id': p.id,
        'name': p.name,
        'category': p.category,
        'cost_price': p.cost_price,
        'selling_price': p.selling_price,
        'stock_available': p.stock_available
    } for p in products]
    
    return jsonify({'success': True, 'data': result}), 200

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    
    # 1. Instantiate the ORM class
    new_product = Product(
        name=data['name'],
        category=data['category'],
        cost_price=data['cost_price'],
        selling_price=data['selling_price'],
        stock_available=data['stock_available']
    )
    
    # 2. Add to session and commit (Transactional)
    db.session.add(new_product)
    db.session.commit() 
    
    return jsonify({'success': True, 'message': 'Product created', 'id': new_product.id}), 201
```

## 🧠 Key Differences for Interview Discussion

If asked in your BCG interview *"Why did you migrate from MongoDB to SQL?"*, here are top-tier answers:
1. **ACID Compliance**: SQL databases natively guarantee robust transactions. If a user buys a product, deducting stock and creating an order happen as a single transaction—both succeed, or both fail.
2. **Schema Rigidity**: E-commerce data (Products, Users, Orders) is highly structured. SQLAlchemy `Models` enforce strict column types (`Float`, `String(200)`), preventing bad data injection that is sometimes easier to sneak into unstructured JSON documents.
3. **Complex Joins**: In the future, if we build an `Orders` and `Reviews` table, executing complex analytical `JOIN` queries across multiple tables is vastly more efficient and standard in PostgreSQL than in MongoDB.
