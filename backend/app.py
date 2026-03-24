from flask import Flask, request, jsonify
from flask_cors import CORS
from bson.objectid import ObjectId
from datetime import datetime
import os
from config import config, Config
from db import get_db
from auth_utils import (
    hash_password, verify_password, generate_token, 
    verify_token, token_required, role_required
)
from pricing_utils import (
    calculate_demand_forecast, get_price_recommendation
)

# Initialize Flask app
app = Flask(__name__, instance_path=os.path.join(os.path.dirname(__file__), 'instance'))
app.config.from_object(config[os.getenv('FLASK_ENV', 'development')])

# Enable CORS
CORS(app)

# ==================== HEALTH CHECK ====================
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Price Optimization Tool API is running',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# ==================== AUTHENTICATION ROUTES ====================
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register new user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        db = get_db()
        users_collection = db['users']
        
        # Check if user already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'message': 'User already exists'}), 400
        
        # Create new user
        user = {
            'name': data['name'],
            'email': data['email'],
            'password': hash_password(data['password']),
            'role': data.get('role', 'buyer'),
            'created_at': datetime.utcnow(),
            'is_verified': False
        }
        
        result = users_collection.insert_one(user)
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': str(result.inserted_id)
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400
        
        db = get_db()
        users_collection = db['users']
        
        user = users_collection.find_one({'email': data['email']})
        
        if not user or not verify_password(data['password'], user['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        token = generate_token(user['_id'], user['email'], user['role'])
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# ==================== PRODUCT ROUTES ====================
@app.route('/api/products', methods=['GET'])
@token_required
def get_products():
    """Get all products with filtering and search"""
    try:
        db = get_db()
        products_collection = db['products']
        
        # Get query parameters
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        # Build query
        query = {}
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'description': {'$regex': search, '$options': 'i'}}
            ]
        if category:
            query['category'] = category
        
        # Get total count
        total = products_collection.count_documents(query)
        
        # Get paginated results
        products = list(products_collection.find(query)
                       .skip((page - 1) * limit)
                       .limit(limit))
        
        # Convert ObjectId to string
        for product in products:
            product['_id'] = str(product['_id'])
        
        return jsonify({
            'success': True,
            'data': products,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/products/<product_id>', methods=['GET'])
@token_required
def get_product(product_id):
    """Get single product"""
    try:
        db = get_db()
        products_collection = db['products']
        
        product = products_collection.find_one({'_id': ObjectId(product_id)})
        
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        product['_id'] = str(product['_id'])
        
        return jsonify({'success': True, 'data': product}), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/products', methods=['POST'])
@role_required(['admin', 'supplier'])
def create_product():
    """Create new product"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'category', 'cost_price', 'selling_price', 'stock_available']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        db = get_db()
        products_collection = db['products']
        
        # Get next product_id
        last_product = products_collection.find_one(sort=[('product_id', -1)])
        next_product_id = (last_product['product_id'] + 1) if last_product else 1
        
        product = {
            'product_id': next_product_id,
            'name': data['name'],
            'description': data.get('description', ''),
            'cost_price': float(data['cost_price']),
            'selling_price': float(data['selling_price']),
            'category': data['category'],
            'stock_available': int(data['stock_available']),
            'units_sold': int(data.get('units_sold', 0)),
            'customer_rating': float(data.get('customer_rating', 4)),
            'demand_forecast': 0,
            'optimized_price': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = products_collection.insert_one(product)
        product['_id'] = str(result.inserted_id)
        
        return jsonify({'success': True, 'message': 'Product created', 'data': product}), 201
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/products/<product_id>', methods=['PUT'])
@role_required(['admin', 'supplier'])
def update_product(product_id):
    """Update product"""
    try:
        data = request.get_json()
        
        db = get_db()
        products_collection = db['products']
        
        update_data = {
            'updated_at': datetime.utcnow()
        }
        
        allowed_fields = ['name', 'description', 'cost_price', 'selling_price', 
                         'category', 'stock_available', 'units_sold', 'customer_rating']
        
        for field in allowed_fields:
            if field in data:
                if field in ['cost_price', 'selling_price', 'customer_rating']:
                    update_data[field] = float(data[field])
                elif field in ['stock_available', 'units_sold']:
                    update_data[field] = int(data[field])
                else:
                    update_data[field] = data[field]
        
        result = products_collection.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        product = products_collection.find_one({'_id': ObjectId(product_id)})
        product['_id'] = str(product['_id'])
        
        return jsonify({'success': True, 'message': 'Product updated', 'data': product}), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/products/<product_id>', methods=['DELETE'])
@role_required(['admin'])
def delete_product(product_id):
    """Delete product"""
    try:
        db = get_db()
        products_collection = db['products']
        
        result = products_collection.delete_one({'_id': ObjectId(product_id)})
        
        if result.deleted_count == 0:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        return jsonify({'success': True, 'message': 'Product deleted'}), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

# ==================== DEMAND FORECAST ROUTES ====================
@app.route('/api/products/<product_id>/forecast', methods=['GET'])
@token_required
def get_demand_forecast(product_id):
    """Get demand forecast for a product"""
    try:
        db = get_db()
        products_collection = db['products']
        
        product = products_collection.find_one({'_id': ObjectId(product_id)})
        
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        # Calculate forecast
        forecast = calculate_demand_forecast(
            product['units_sold'],
            product['stock_available'],
            product['customer_rating']
        )
        
        return jsonify({
            'success': True,
            'data': {
                'product_id': str(product['_id']),
                'product_name': product['name'],
                'demand_forecast': forecast,
                'selling_price': product['selling_price'],
                'units_sold': product['units_sold'],
                'stock_available': product['stock_available']
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/products/forecasts/all', methods=['GET'])
@token_required
def get_all_forecasts():
    """Get demand forecasts for all products"""
    try:
        db = get_db()
        products_collection = db['products']
        
        products = list(products_collection.find())
        
        forecasts = []
        for product in products:
            forecast = calculate_demand_forecast(
                product['units_sold'],
                product['stock_available'],
                product['customer_rating']
            )
            
            forecasts.append({
                'product_id': str(product['_id']),
                'product_name': product['name'],
                'category': product['category'],
                'demand_forecast': forecast,
                'selling_price': product['selling_price'],
                'cost_price': product['cost_price'],
                'units_sold': product['units_sold'],
                'stock_available': product['stock_available'],
                'customer_rating': product['customer_rating']
            })
        
        return jsonify({'success': True, 'data': forecasts}), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

# ==================== PRICING OPTIMIZATION ROUTES ====================
@app.route('/api/products/<product_id>/optimize-price', methods=['GET'])
@token_required
def optimize_product_price(product_id):
    """Get optimized price for a product"""
    try:
        db = get_db()
        products_collection = db['products']
        
        product = products_collection.find_one({'_id': ObjectId(product_id)})
        
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        # Calculate demand forecast first
        forecast = calculate_demand_forecast(
            product['units_sold'],
            product['stock_available'],
            product['customer_rating']
        )
        
        # Get pricing recommendation
        recommendation = get_price_recommendation(
            product['cost_price'],
            product['selling_price'],
            forecast,
            product['units_sold'],
            product['stock_available']
        )
        
        # Update product with optimized price and forecast
        products_collection.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': {
                'optimized_price': recommendation['optimized_price'],
                'demand_forecast': forecast,
                'updated_at': datetime.utcnow()
            }}
        )
        
        return jsonify({
            'success': True,
            'data': {
                'product_id': str(product['_id']),
                'product_name': product['name'],
                'category': product['category'],
                'cost_price': product['cost_price'],
                'selling_price': product['selling_price'],
                'optimized_price': recommendation['optimized_price'],
                'demand_forecast': forecast,
                'price_change_percent': recommendation['price_change_percent'],
                'recommendation': recommendation['recommendation'],
                'reason': recommendation['reason']
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/pricing-optimization/all', methods=['GET'])
@token_required
def get_all_optimized_prices():
    """Get optimized prices for all products"""
    try:
        db = get_db()
        products_collection = db['products']
        
        products = list(products_collection.find())
        
        optimizations = []
        for product in products:
            forecast = calculate_demand_forecast(
                product['units_sold'],
                product['stock_available'],
                product['customer_rating']
            )
            
            recommendation = get_price_recommendation(
                product['cost_price'],
                product['selling_price'],
                forecast,
                product['units_sold'],
                product['stock_available']
            )
            
            optimizations.append({
                'product_id': str(product['_id']),
                'product_name': product['name'],
                'category': product['category'],
                'description': product['description'],
                'cost_price': product['cost_price'],
                'selling_price': product['selling_price'],
                'optimized_price': recommendation['optimized_price'],
                'demand_forecast': forecast,
                'stock_available': product['stock_available'],
                'price_change_percent': recommendation['price_change_percent'],
                'recommendation': recommendation['recommendation'],
                'reason': recommendation['reason']
            })
        
        return jsonify({'success': True, 'data': optimizations}), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

# ==================== SEARCH & FILTER ====================
@app.route('/api/products/search', methods=['GET'])
@token_required
def search_products():
    """Search products"""
    try:
        query = request.args.get('q', '')
        category = request.args.get('category', '')
        
        db = get_db()
        products_collection = db['products']
        
        search_query = {}
        
        if query:
            search_query['$or'] = [
                {'name': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}}
            ]
        
        if category:
            search_query['category'] = category
        
        products = list(products_collection.find(search_query).limit(20))
        
        for product in products:
            product['_id'] = str(product['_id'])
        
        return jsonify({'success': True, 'data': products}), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

@app.route('/api/categories', methods=['GET'])
@token_required
def get_categories():
    """Get all unique categories"""
    try:
        db = get_db()
        products_collection = db['products']
        
        categories = products_collection.distinct('category')
        
        return jsonify({'success': True, 'data': categories}), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500

# ==================== ERROR HANDLERS ====================
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
