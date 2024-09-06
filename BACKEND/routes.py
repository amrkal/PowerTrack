# from flask import Blueprint, request, jsonify, g
from datetime import datetime, timedelta
from flask import Blueprint, render_template, request, jsonify, url_for, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Category, Item
from bson.objectid import ObjectId
from app import mail,Message
from extensions import mail  # Import from extensions
import jwt


auth_bp = Blueprint('auth', __name__)
items_bp = Blueprint('items', __name__)
users_bp = Blueprint('users', __name__)
resetPassword_bp = Blueprint('resetPassword', __name__)
unverified_users = {}


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
        # User.create_user(username=username, password=hashed_password, phone_number=phone_number, name=name, family_name=family_name, email=email)
        unverified_users[phone_number] = {
            'username': username,
            'password': password,
            'name': name,
            'family_name': family_name,
            'email': email,
        }
        

        return jsonify({'message': 'User registered successfully and is approved!', 'username': username}), 200
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
        return jsonify({'message': 'Verification code sent'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/verify-code', methods=['POST'])
def verify_code():
    try:
        data = request.json
        phone_number = data.get('phone_number')

        # Debugging: Print incoming request data to console
        print(f"Verifying user for phone number: {phone_number}")

        # Verify if the phone number exists in unverified users
        if phone_number not in unverified_users:
            return jsonify({'error': 'Phone number not found or not registered.'}), 404

        user_data = unverified_users[phone_number]

        # Skip the verification code check for now
        # Directly create the user in the main database
        User.create_user(
            username=user_data['username'],
            password=user_data['password'],
            phone_number=phone_number,
            name=user_data['name'],
            family_name=user_data['family_name'],
            email=user_data['email']
        )

        # Remove user from unverified_users after successful registration
        del unverified_users[phone_number]

        return jsonify({'message': 'User verified and registered successfully!'}), 200

    except Exception as e:
        # Log the exception details for debugging
        print(f"Error in verify_code: {str(e)}")
        return jsonify({'error': 'An internal error occurred', 'details': str(e)}), 500
    

















# User Routes
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



















# Reset Password Routes
@resetPassword_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        # Find the user by email
        user = User.find_by_email(email)
        if not user:
            return jsonify({'error': 'User with this email does not exist'}), 404

        # Generate a token for password reset (valid for 30 minutes)
        token = jwt.encode({
            'email': email,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        # Send reset email with a link to reset the password
        reset_link = url_for('resetPassword.reset_password_token', token=token, _external=True)
        msg = Message("Password Reset Request", sender=current_app.config['MAIL_DEFAULT_SENDER'], recipients=[email])
        msg.body = f"Click the link to reset your password: {reset_link}"
        mail.send(msg)

        return jsonify({'message': 'Password reset email sent!'}), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log the error to console
        return jsonify({'error': 'An internal error occurred', 'details': str(e)}), 500
    
@resetPassword_bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password_token(token):
    try:
        if request.method == 'GET':
            # Decode the token to verify its validity
            try:
                decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
                email = decoded['email']
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'The token has expired'}), 400
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 400

            # Render a page to allow the user to input the new password
            return render_template('reset_password_form.html', token=token)

        if request.method == 'POST':
            data = request.form  # Fetching form data
            new_password = data.get('password')

            if not new_password:
                return jsonify({'error': 'Password is required'}), 400

            # Decode the token to verify its validity
            decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            email = decoded['email']

            # Find the user by email
            user = User.find_by_email(email)
            if not user:
                return jsonify({'error': 'User not found'}), 404

            # Hash the new password and update it in the database
            User.update_password(user['_id'], new_password)

            return jsonify({'message': 'Password has been reset successfully'}), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log the error to console
        return jsonify({'error': 'An internal error occurred', 'details': str(e)}), 500


























# Category Routes
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
        # Get page and limit from query parameters, with default values
        page = int(request.args.get('page', 1))
        limit = request.args.get('limit')  # No default value for limit
        
        # If limit is not provided or is 0, fetch all items
        if not limit or int(limit) == 0:
            items = Item.get_all()  # Fetch all items from the database
        else:
            limit = int(limit)
            skip = (page - 1) * limit
            items = Item.get_paginated(skip, limit)  # Fetch paginated items
        
        total_items = Item.count_all()  # Get total number of items
        
        return jsonify({
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
            'limit': limit
        })
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