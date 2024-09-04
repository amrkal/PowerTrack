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


# Item Routes
@items_bp.route('/items', methods=['GET'])
def get_items():
    try:
        items = Item.get_all()
        return jsonify([{
             'id': str(item['_id']),
            'item_key': item.get('ItemKey'),  # Change 'ItemKey' to match your field names
            'item_name': item.get('ItemName'),  # Change 'ItemName' to match your field names
            'description': item.get('description', ''),  # Use .get() to avoid KeyError
            'price': item.get('Price', 0),  # Provide default values to avoid KeyError
            'purch_price': item.get('PurchPrice', 0),
            'quantity': item.get('Quantity', 0),
            'discount_code': item.get('DiscountCode', '')
        } for item in items])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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