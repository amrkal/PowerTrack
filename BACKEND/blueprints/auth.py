from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import User

auth_bp = Blueprint('auth', __name__)
# Temporary in-memory store for unverified users (in production, use a database or Redis)
unverified_users = {}

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
    

# @auth_bp.route('/verify-code', methods=['POST'])
# def verify_code():
#     try:
#         data = request.json
#         phone_number = data.get('phone_number')
#         code = data.get('code')

#         if not phone_number or not code:
#             return jsonify({'error': 'Phone number and code are required'}), 400

#         # Verify if the phone number exists in unverified users
#         if phone_number not in unverified_users:
#             return jsonify({'error': 'Phone number not found or not registered.'}), 404

#         user_data = unverified_users[phone_number]
        
#         # Check if the verification code matches
#         if int(code) != user_data['verification_code']:
#             return jsonify({'error': 'Invalid verification code.'}), 400

#         # Verification successful, create the user in the main database
#         User.create_user(
#             username=user_data['username'],
#             password=user_data['password'],
#             phone_number=phone_number,
#             name=user_data['name'],
#             family_name=user_data['family_name'],
#             email=user_data['email']
#         )

#         # Remove user from unverified_users
#         del unverified_users[phone_number]

#         return jsonify({'message': 'User verified and registered successfully!'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500