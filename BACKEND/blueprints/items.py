from bson import ObjectId
from flask import Blueprint, jsonify, request
from models import Category, Item

items_bp = Blueprint('items', __name__)

@items_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.get_all()
        return jsonify([category['name'] for category in categories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@items_bp.route('/items', methods=['GET'])
def get_items():
    try:
        # Get page and limit from query parameters, with default values
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))  # Default limit of 20 items per page
        
        # Enforce a maximum limit to prevent fetching too many items at once
        max_limit = 100
        if limit > max_limit:
            limit = max_limit

        skip = (page - 1) * limit
        
        # Fetch paginated items
        items = Item.get_paginated(skip, limit)
        
        # Get total number of items
        total_items = Item.count_all()
        
        # Prepare response data
        response_data = {
            'items': [{
                'id': str(item['_id']),
                'item_key': item.get('ItemKey'),
                'item_name': item.get('ItemName'),
                'description': item.get('description', ''),
                'price': item.get('Price', 0),
                'purch_price': item.get('PurchPrice', 0),
                'quantity': item.get('Quantity', 0),
                'discount_code': item.get('DiscountCode', '')
            } for item in items],
            'total_items': total_items,
            'page': page,
            'limit': limit,
            "hasMore": True,
        }
        
        return jsonify(response_data)
    
    except ValueError:
        # Handle case where page or limit is not a valid integer
        return jsonify({'error': 'Invalid pagination parameters'}), 400
    
    except Exception as e:
        # Log the exception for debugging
        print(f"Error fetching items: {e}")
        return jsonify({'error': 'An internal server error occurred'}), 500

# # Item Routes
# @items_bp.route('/items', methods=['GET'])
# def get_items():
#     try:
#         # Get page and limit from query parameters, with default values
#         page = int(request.args.get('page', 1))
#         limit = request.args.get('limit')  # No default value for limit
        
#         # If limit is not provided or is 0, fetch all items
#         if not limit or int(limit) == 0:
#             items = Item.get_all()  # Fetch all items from the database
#         else:
#             limit = int(limit)
#             skip = (page - 1) * limit
#             items = Item.get_paginated(skip, limit)  # Fetch paginated items
        
#         total_items = Item.count_all()  # Get total number of items
        
#         return jsonify({
#             'items': [{
#                 'id': str(item['_id']),
#                 'item_key': item.get('ItemKey'),
#                 'item_name': item.get('ItemName'),
#                 'description': item.get('description', ''),
#                 'price': item.get('Price', 0),
#                 'purch_price': item.get('PurchPrice', 0),
#                 'quantity': item.get('Quantity', 0),
#                 'discount_code': item.get('DiscountCode', '')
#             } for item in items],
#             'total_items': total_items,
#             'page': page,
#             'limit': limit
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@items_bp.route('/items', methods=['POST'])
def create_item():
    try:
        data = request.json
        item_id = Item.create_item(data).inserted_id
        return jsonify({"message": "Item created", "item_id": str(item_id)}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@items_bp.route('/items/<item_id>', methods=['GET'])
def get_item_by_id(item_id):
    try:
        item = Item.find_by_id(ObjectId(item_id))
        if item:
            return jsonify({
             'id': str(item['_id']),
            'item_key': item.get('ItemKey'),  # Change 'ItemKey' to match your field names
            'item_name': item.get('ItemName'),  # Change 'ItemName' to match your field names
            'description': item.get('description', ''),  # Use .get() to avoid KeyError
            'price': item.get('Price', 0),  # Provide default values to avoid KeyError
            'currency': item.get('Currency', ''),
            'purch_price': item.get('PurchPrice', 0),
            'quantity': item.get('Quantity', 0),
            'discount_code': item.get('DiscountCode', '')
            })
        else:
            return jsonify({"message": "Item not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@items_bp.route('/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        data = request.json
        result = Item.update_item(ObjectId(item_id), data)
        if result.matched_count:
            return jsonify({"message": "Item updated"})
        else:
            return jsonify({"message": "Item not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@items_bp.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    try:
        result = Item.delete_item(ObjectId(item_id))
        if result.deleted_count:
            return jsonify({"message": "Item deleted"})
        else:
            return jsonify({"message": "Item not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400