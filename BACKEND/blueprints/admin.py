from flask import Blueprint, Flask, jsonify, request
from flask_jwt_extended import jwt_required


admin_bp = Blueprint('admin', __name__)

# @admin_bp.route('/admin/users', methods=['GET'])
# @jwt_required()
# def get_users():
#     # Logic to fetch users from database
#     users = [{'id': 1, 'name': 'Admin User'}, {'id': 2, 'name': 'Regular User'}]  # Example
#     return jsonify(users)

# @admin_bp.route('/admin/products', methods=['GET'])
# @jwt_required()
# def get_products():n
#     # Logic to fetch products from database
#     products = [{'id': 1, 'name': 'Product 1'}, {'id': 2, 'name': 'Product 2'}]  # Example
#     return jsonify(products)
