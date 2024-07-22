from flask import Blueprint, jsonify
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
        items = Item.get_all()
        return jsonify([{
            'name': item['name'],
            'description': item['description'],
            'price': str(item['price']),
            'category': item['category']
        } for item in items])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
