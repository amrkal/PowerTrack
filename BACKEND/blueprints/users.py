from flask import Blueprint, request, jsonify
from models import User

users_bp = Blueprint('users', __name__)

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
