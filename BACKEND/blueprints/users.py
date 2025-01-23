from fileinput import filename
from bson import ObjectId
from flask import Blueprint, request, jsonify, send_file
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required  # Import create_access_token
from werkzeug.utils import secure_filename
import os
from flask import current_app
import uuid
from werkzeug.utils import secure_filename
from flask import send_from_directory

users_bp = Blueprint('users', __name__)


@users_bp.route('/protected-image', methods=['GET'])
@jwt_required()
def get_protected_image():
    # 1. Identify the user
    user_id = get_jwt_identity()
    user = User.find_by_id(ObjectId(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    # 2. Check if user has a stored image path
    profile_image_path = user.get('profile_image')
    if not profile_image_path:
        return jsonify({"error": "No profile image set"}), 404

    # 3. Make sure the file exists
    if not os.path.exists(profile_image_path):
        return jsonify({"error": "File not found on server"}), 404

    # 4. Return the file as a send_file (Flask will handle MIME type if extension is known)
    # Or you can manually set a mimetype if needed
    return send_file(profile_image_path, mimetype='image/jpeg')


# Serve files from the 'uploads' directory
@users_bp.route('/uploads/<path:filename>', methods=['GET'])
def serve_uploaded_file(    ):
    return send_from_directory('uploads', filename)

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
            'prices_tag': user.get('prices_tag'),
            'profile_image': user.get('profile_image', ''),
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
    


@users_bp.route('/profileImage', methods=['POST'])
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    if 'profileImage' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['profileImage']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # Generate a unique filename
    filename = secure_filename(file.filename)
    extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    unique_filename = f"{uuid.uuid4().hex}.{extension}" if extension else uuid.uuid4().hex

    # Save the file in 'uploads'
    uploads_path = "./uploads"
    os.makedirs(uploads_path, exist_ok=True)
    file_path = os.path.join(uploads_path, unique_filename)
    file.save(file_path)

    # Create a public URL for the image
    # Assuming your Flask runs at http://your-domain-or-ip:5000
    public_url = f"http://your-domain-or-ip:5000/users/uploads/{unique_filename}"

    # Update user record with the public URL
    user = User.find_by_id(ObjectId(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Save the public_url in the database
    User.update_user(user_id, {"profile_image": public_url})

    return jsonify({"filePath": public_url}), 200