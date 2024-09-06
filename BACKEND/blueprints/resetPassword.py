from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, url_for, render_template, current_app
from flask_mail import Message
from werkzeug.security import generate_password_hash
from models import User
import jwt
from extensions import mail  # Import from extensions

resetPassword_bp = Blueprint('resetPassword', __name__)

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