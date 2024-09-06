from flask import Blueprint, request, jsonify
from models import User
from werkzeug.security import generate_password_hash, check_password_hash

users_bp = Blueprint('users', __name__)


@users_bp.route('/login', methods=['POST'])
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
