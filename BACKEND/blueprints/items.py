from bson import ObjectId
from flask import Blueprint, jsonify, request
from models import Item

items_bp = Blueprint('items', __name__)

# Route to get all items by category (sortGroup) and price list number
@items_bp.route('/items/price/<sortGroup>', methods=['GET'])
def get_items_by_category_price(sortGroup):
    try:
        # Get the PriceListNumber from the request's query parameters (default to 1 if not provided)
        price_list_number = request.args.get('priceListNumber', default=1, type=int)
        print(f"Received sortGroup: {sortGroup}, PriceListNumber: {price_list_number}")

        # Pass both sortGroup and PriceListNumber to the method
        items = Item.get_all_items_by_category_price(sortGroup, price_list_number)
        return jsonify({"items": items}), 200
    except Exception as e:
        print(f"Error fetching items by category: {e}")
        return jsonify({'error': str(e)}), 500
    
# Route to get all items by category (sortGroup) and price list number (optional)
@items_bp.route('/items/<sortGroup>', methods=['GET'])
def get_items_by_category(sortGroup):
    try:
        # Get the PriceListNumber from the request's query parameters (default to 1 if not provided)
        price_list_number = request.args.get('priceListNumber', default=None, type=int)

        items = Item.get_all_items_by_category(sortGroup)
        return jsonify({"items": items}), 200
    except Exception as e:
        print(f"Error fetching items by category: {e}")
        return jsonify({'error': str(e)}), 500

# Route to fetch all items (without pagination)
@items_bp.route('/items', methods=['GET'])
def get_items():
    try:
        PriceListNumber = request.args.get('prices_tag', type=int)  # Fetch prices_tag from frontend
        items = Item.get_all()  # Fetch all items

        response_data = {'items': []}
        
        # For each item, fetch its price using the method get_price_by_item_and_tag
        for item in items:
            price = Item.get_price_by_item_and_tag(item['ItemKey'], PriceListNumber)  # Fetch the correct price
            response_data['items'].append({
                'id': str(item['_id']),
                'item_key': item.get('ItemKey'),
                'item_name': item.get('ItemName'),
                'description': item.get('description', ''),
                'price': price,  # Use fetched price
                'quantity': item.get('Quantity', 0),
                'sortGroup': item.get('SortGroup', 'others'),
            })
        
        return jsonify(response_data), 200
    except Exception as e:
        print(f"Error fetching items: {e}")
        return jsonify({'error': 'Internal server error occurred'}), 500

# Route to fetch all items with pagination and optional search
@items_bp.route('/itemss', methods=['GET'])
def get_itemss():
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        PriceListNumber = request.args.get('prices_tag', default=1, type=int)
        sort_group = request.args.get('sortGroup', 'all')
        search_query = request.args.get('search', '').strip()

        skip = (page - 1) * limit

        # Build query based on sortGroup and search query
        query = {}
        if sort_group and sort_group != 'all':
            query['SortGroup'] = sort_group
        if search_query:
            query['ItemName'] = {'$regex': search_query, '$options': 'i'}

        total_items = Item.get_total_count(query)  # Get the total number of items matching the query

        if total_items == 0:
            return jsonify({'items': [], 'page': page, 'limit': limit, 'hasMore': False}), 200

        # Fetch paginated items
        items = Item.get_paginated(skip, limit, query)

        response_data = {
            'items': [],
            'page': page,
            'limit': limit,
            'hasMore': (skip + limit) < total_items,
        }

        for item in items:
            price = Item.get_price_by_item_and_tag(item['ItemKey'], PriceListNumber)
            response_data['items'].append({
                'id': str(item['_id']),
                'item_key': item.get('ItemKey'),
                'item_name': item.get('ItemName'),
                'description': item.get('description', ''),
                'price': price,
                'sortGroup': item.get('SortGroup', 'others'),
                'quantity': item.get('Quantity', 0),
            })

        return jsonify(response_data), 200
    except Exception as e:
        print(f"Error fetching paginated items: {e}")
        return jsonify({'error': str(e)}), 500

# Route to search items based on a search query
@items_bp.route('/search', methods=['GET'])
def search_items():
    try:
        query = request.args.get('query', '')
        if not query:
            return jsonify({"error": "Search query is required"}), 400

        items = Item.search(query)  # Search using the query

        items_list = []
        for item in items:
            items_list.append({
                'id': str(item['_id']),
                'item_key': item.get('ItemKey'),
                'item_name': item.get('ItemName'),
                'description': item.get('description', ''),
                'price': item.get('price', 0),
                'sortGroup': item.get('SortGroup', 'others'),
                'quantity': item.get('Quantity', 0),
            })

        return jsonify({'items': items_list}), 200
    except Exception as e:
        print(f"Error occurred during search: {e}")
        return jsonify({"error": str(e)}), 500

# Route to fetch a single item by ID
@items_bp.route('/items/<item_id>', methods=['GET'])
def get_item_by_id(item_id):
    try:
        item = Item.find_by_id(ObjectId(item_id))
        if item:
            return jsonify({
                'id': str(item['_id']),
                'item_key': item.get('ItemKey'),
                'item_name': item.get('ItemName'),
                'description': item.get('description', ''),
                'price': item.get('Price', 0),
                'purch_price': item.get('PurchPrice', 0),
                'quantity': item.get('Quantity', 0),
                'sortGroup': item.get('SortGroup', 'others'),
            }), 200
        else:
            return jsonify({"message": "Item not found"}), 404
    except Exception as e:
        print(f"Error fetching item by ID: {e}")
        return jsonify({"error": str(e)}), 500

# Route to create a new item
@items_bp.route('/items', methods=['POST'])
def create_item():
    try:
        data = request.json
        item_id = Item.create_item(data)
        return jsonify({"message": "Item created", "item_id": str(item_id)}), 201
    except Exception as e:
        print(f"Error creating item: {e}")
        return jsonify({"error": str(e)}), 400

# Route to update an item by ID
@items_bp.route('/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        data = request.json
        result = Item.update_item(ObjectId(item_id), data)
        if result.matched_count:
            return jsonify({"message": "Item updated"}), 200
        else:
            return jsonify({"message": "Item not found"}), 404
    except Exception as e:
        print(f"Error updating item: {e}")
        return jsonify({"error": str(e)}), 400

# Route to delete an item by ID
@items_bp.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    try:
        result = Item.delete_item(ObjectId(item_id))
        if result.deleted_count:
            return jsonify({"message": "Item deleted"}), 200
        else:
            return jsonify({"message": "Item not found"}), 404
    except Exception as e:
        print(f"Error deleting item: {e}")
        return jsonify({"error": str(e)}), 400
