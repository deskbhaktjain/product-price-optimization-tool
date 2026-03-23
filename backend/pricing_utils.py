"""Pricing optimization and demand forecasting utilities"""

def calculate_demand_forecast(units_sold, stock_available, customer_rating):
    """
    Calculate demand forecast based on historical data
    Formula: (units_sold * customer_rating) / 5 * (stock_available / max(100, stock_available))
    """
    if stock_available == 0:
        return units_sold
    
    base_demand = (units_sold * customer_rating) / 5
    stock_factor = min(1.5, stock_available / 100) if stock_available > 0 else 1
    forecast = base_demand * stock_factor
    
    return round(forecast, 2)

def calculate_optimized_price(cost_price, selling_price, demand_forecast, units_sold, stock_available):
    """
    Calculate optimized price using dynamic pricing strategy
    Takes into account cost, demand, and inventory levels
    
    Strategy:
    - If demand is high and stock is low: increase price
    - If demand is low and stock is high: decrease price
    - If demand is moderate: keep price close to selling price but optimize for margin
    """
    
    if demand_forecast == 0:
        return round(selling_price, 2)
    
    # Calculate demand intensity (0 to 1, where 1 is very high demand)
    demand_intensity = min(1, demand_forecast / max(units_sold, 1))
    
    # Calculate stock intensity (0 to 1, where 1 is low stock)
    if stock_available > 1000:
        stock_intensity = 0
    elif stock_available > 500:
        stock_intensity = 0.2
    elif stock_available > 100:
        stock_intensity = 0.5
    else:
        stock_intensity = 1
    
    # Calculate margin optimization
    profit_margin = selling_price - cost_price
    
    # Apply dynamic adjustment
    price_adjustment = 1.0
    
    # Increase price if high demand and low stock
    if demand_intensity > 0.7 and stock_intensity > 0.5:
        price_adjustment = 1.15
    elif demand_intensity > 0.5 and stock_intensity > 0.3:
        price_adjustment = 1.05
    # Decrease price if low demand and high stock
    elif demand_intensity < 0.3 and stock_intensity < 0.2:
        price_adjustment = 0.85
    elif demand_intensity < 0.5 and stock_intensity < 0.4:
        price_adjustment = 0.95
    
    optimized_price = selling_price * price_adjustment
    
    # Ensure price is above cost
    optimized_price = max(cost_price * 1.1, optimized_price)
    
    return round(optimized_price, 2)

def get_price_recommendation(cost_price, selling_price, demand_forecast, units_sold, stock_available):
    """
    Get comprehensive pricing recommendation
    """
    optimized_price = calculate_optimized_price(
        cost_price, 
        selling_price, 
        demand_forecast, 
        units_sold, 
        stock_available
    )
    
    price_change = ((optimized_price - selling_price) / selling_price) * 100 if selling_price > 0 else 0
    
    if price_change > 5:
        recommendation = "Increase price"
        reason = "High demand with low stock"
    elif price_change < -5:
        recommendation = "Decrease price"
        reason = "Low demand with high stock"
    else:
        recommendation = "Maintain price"
        reason = "Price is optimal"
    
    return {
        'optimized_price': optimized_price,
        'price_change_percent': round(price_change, 2),
        'recommendation': recommendation,
        'reason': reason
    }
