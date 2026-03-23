"""
Seed MongoDB with mock data for testing
Run: python seed_db.py
"""

from db import get_db
from datetime import datetime
from auth_utils import hash_password

# Sample product data provided by client
MOCK_PRODUCTS = [
    {
        "product_id": 1,
        "name": "Eco-Friendly Water Bottle",
        "description": "A sustainable, reusable water bottle made from recycled materials.",
        "cost_price": 5,
        "selling_price": 12.99,
        "category": "Outdoor & Sports",
        "stock_available": 500,
        "units_sold": 200,
        "customer_rating": 4,
        "demand_forecast": 250,
        "optimized_price": 11.5
    },
    {
        "product_id": 2,
        "name": "Organic Cotton T-Shirt",
        "description": "Comfortable and eco-friendly organic cotton t-shirt available in multiple sizes.",
        "cost_price": 8,
        "selling_price": 22.99,
        "category": "Apparel",
        "stock_available": 1200,
        "units_sold": 450,
        "customer_rating": 4.5,
        "demand_forecast": 520,
        "optimized_price": 21.99
    },
    {
        "product_id": 3,
        "name": "Bamboo Toothbrush",
        "description": "Eco-friendly bamboo toothbrush with biodegradable bristles.",
        "cost_price": 1.5,
        "selling_price": 4.99,
        "category": "Personal Care",
        "stock_available": 2500,
        "units_sold": 800,
        "customer_rating": 4.2,
        "demand_forecast": 920,
        "optimized_price": 4.49
    },
    {
        "product_id": 4,
        "name": "Portable Solar Charger",
        "description": "Compact solar charger for mobile devices and small electronics.",
        "cost_price": 25,
        "selling_price": 59.99,
        "category": "Electronics",
        "stock_available": 150,
        "units_sold": 120,
        "customer_rating": 3.8,
        "demand_forecast": 140,
        "optimized_price": 64.99
    },
    {
        "product_id": 5,
        "name": "Stainless Steel Food Container",
        "description": "Durable, leak-proof stainless steel container for food storage.",
        "cost_price": 12,
        "selling_price": 29.99,
        "category": "Kitchen",
        "stock_available": 800,
        "units_sold": 350,
        "customer_rating": 4.6,
        "demand_forecast": 420,
        "optimized_price": 28.49
    },
    {
        "product_id": 6,
        "name": "Eco Yoga Mat",
        "description": "Natural rubber yoga mat made from sustainable materials.",
        "cost_price": 18,
        "selling_price": 45.99,
        "category": "Fitness",
        "stock_available": 300,
        "units_sold": 180,
        "customer_rating": 4.4,
        "demand_forecast": 220,
        "optimized_price": 42.99
    },
    {
        "product_id": 7,
        "name": "Canvas Shopping Bag",
        "description": "Durable, reusable canvas shopping bag with comfortable handles.",
        "cost_price": 4,
        "selling_price": 12.99,
        "category": "Accessories",
        "stock_available": 1500,
        "units_sold": 600,
        "customer_rating": 4.3,
        "demand_forecast": 700,
        "optimized_price": 11.99
    },
    {
        "product_id": 8,
        "name": "Bamboo Cutting Board Set",
        "description": "Set of three bamboo cutting boards in different sizes.",
        "cost_price": 15,
        "selling_price": 34.99,
        "category": "Kitchen",
        "stock_available": 400,
        "units_sold": 140,
        "customer_rating": 4.5,
        "demand_forecast": 180,
        "optimized_price": 32.99
    },
    {
        "product_id": 9,
        "name": "LED Plant Growth Light",
        "description": "Energy-efficient LED light for indoor plant growing.",
        "cost_price": 35,
        "selling_price": 79.99,
        "category": "Gardening",
        "stock_available": 100,
        "units_sold": 60,
        "customer_rating": 4.1,
        "demand_forecast": 85,
        "optimized_price": 84.99
    },
    {
        "product_id": 10,
        "name": "Natural Soap Collection",
        "description": "Set of handmade natural soaps with essential oils.",
        "cost_price": 6,
        "selling_price": 15.99,
        "category": "Personal Care",
        "stock_available": 900,
        "units_sold": 350,
        "customer_rating": 4.7,
        "demand_forecast": 420,
        "optimized_price": 14.99
    }
]

# Sample user data
MOCK_USERS = [
    {
        "name": "Admin User",
        "email": "admin@example.com",
        "password": hash_password("admin123"),
        "role": "admin",
        "is_verified": True
    },
    {
        "name": "Amish Singh",
        "email": "buyer@example.com",
        "password": hash_password("buyer123"),
        "role": "buyer",
        "is_verified": True
    },
    {
        "name": "Supplier User",
        "email": "supplier@example.com",
        "password": hash_password("supplier123"),
        "role": "supplier",
        "is_verified": True
    }
]

def seed_database():
    """Seed database with mock data"""
    try:
        db = get_db()
        
        # Clear existing collections
        print("Clearing existing collections...")
        db['products'].drop()
        db['users'].drop()
        
        # Insert products
        print("Inserting products...")
        products_collection = db['products']
        products_with_timestamp = []
        
        for product in MOCK_PRODUCTS:
            product_doc = product.copy()
            product_doc['created_at'] = datetime.utcnow()
            product_doc['updated_at'] = datetime.utcnow()
            products_with_timestamp.append(product_doc)
        
        result = products_collection.insert_many(products_with_timestamp)
        print(f"✓ Inserted {len(result.inserted_ids)} products")
        
        # Insert users
        print("Inserting users...")
        users_collection = db['users']
        users_with_timestamp = []
        
        for user in MOCK_USERS:
            user_doc = user.copy()
            user_doc['created_at'] = datetime.utcnow()
            users_with_timestamp.append(user_doc)
        
        result = users_collection.insert_many(users_with_timestamp)
        print(f"✓ Inserted {len(result.inserted_ids)} users")
        
        # Create indexes
        print("Creating indexes...")
        products_collection.create_index('product_id')
        products_collection.create_index('name')
        products_collection.create_index('category')
        products_collection.create_index([('name', 'text'), ('description', 'text')])
        
        users_collection.create_index('email', unique=True)
        
        print("✓ Indexes created")
        
        print("\n✅ Database seeding completed successfully!")
        print("\n📝 Test Credentials:")
        print("   Admin       - admin@example.com / admin123")
        print("   Buyer       - buyer@example.com / buyer123")
        print("   Supplier    - supplier@example.com / supplier123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        raise

if __name__ == '__main__':
    seed_database()
