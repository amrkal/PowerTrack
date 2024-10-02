from bson import ObjectId
from flask import Blueprint, request, jsonify
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required  # Import create_access_token

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
        
        # Pass the user's MongoDB ObjectId as the identity
        access_token = create_access_token(identity=str(user['_id']))  
        return jsonify({'access_token': access_token, 'username': username}), 200
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
    


@users_bp.route('/profile', methods=['GET'])
@jwt_required()  # Ensure the user is authenticated
def get_profile():
    try:
        user_id = get_jwt_identity()  # Extract the user ID from the JWT token
        
        # Fetch user from the database
        user = User.find_by_id(ObjectId(user_id))  # Assuming you're using MongoDB

        if not user:
            return jsonify({'error': 'User not found'}), 404
        print(user)
        # Return the user profile data with default empty values if fields are missing
        return jsonify({
            'name': user.get('name', ''),
            'familyName': user.get('family_name', ''),
            'email': user.get('email', ''),
            'city': user.get('city', ''),         # If city is missing, return an empty string
            'zip_code': user.get('zip_code', ''), # If zip_code is missing, return an empty string
            'address': user.get('address', ''),  # If address is missing, return an empty string
            'prices_tag': user.get('prices_tag')
        }), 200
    except Exception as e:
        # Log the error for debugging
        return jsonify({'error': 'An internal server error occurred.'}), 500



@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.json

        # Update user details
        User.update_user(user_id, data)

        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500