# from flask import Blueprint, request, jsonify, g
from flask import Blueprint, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Category, Item

auth_bp = Blueprint('auth', __name__)
items_bp = Blueprint('items', __name__)
users_bp = Blueprint('users', __name__)

# Authentication Routes
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        phone_number = data.get('phone_number')
        name = data.get('name')
        family_name = data.get('family_name')
        email = data.get('email')

        if not username or not password or not phone_number or not name or not family_name or not email:
            return jsonify({'error': 'All fields are required'}), 400

        if User.find_by_username(username):
            return jsonify({'error': 'Username already exists'}), 400

        if User.find_by_phone_number(phone_number):
            return jsonify({'error': 'Phone number already exists'}), 400

        if User.find_by_email(email):
            return jsonify({'error': 'Email already exists'}), 400

        User.create_user(data)

        return jsonify({'message': 'User registered successfully and is approved!', 'username': username}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        user = User.find_by_username(username)

        if not user or not check_password_hash(user['password'], password):
            return jsonify({'error': 'Invalid username or password'}), 400

        if not user.get('is_approved'):
            return jsonify({'error': 'User is not approved by admin'}), 403

        return jsonify({'message': 'Login successful!', 'username': username}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/send-code', methods=['POST'])
def send_code():
    try:
        data = request.json
        phone_number = data.get('phone_number')

        if not phone_number:
            return jsonify({'error': 'Phone number is required'}), 400

        # Mock response for sending code
        return jsonify({'message': 'Verification code sent55'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify-code', methods=['POST'])
def verify_code():
    try:
        data = request.json
        phone_number = data.get('phone_number')
        code = data.get('code')

        if not phone_number or not code:
            return jsonify({'error': 'Phone number and code are required'}), 400

        # Mock response for verifying code
        return jsonify({'verified': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User Routes
@users_bp.route('/approve-user', methods=['POST'])
def approve_user():
    try:
        data = request.json
        username = data.get('username')

        if not username:
            return jsonify({'error': 'Username is required'}), 400

        user = User.find_by_username(username)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        User.approve_user(username)

        return jsonify({'message': 'User approved successfully!', 'username': username}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Item Routes
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
