from flask import Blueprint, request, jsonify, render_template, current_app, url_for
from flask_mail import Message
from passlib.hash import bcrypt
from datetime import datetime
from app.extensions import mail
from app.models import User
from app.models import PasswordResetToken  # The class we created above

resetPassword_bp = Blueprint('resetPassword', __name__)

@resetPassword_bp.route('/reset-password', methods=['POST'])
def request_password_reset():
    """1) User enters email to request a reset. A short-lived, one-time token is created and emailed."""
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    # Check if user exists
    user = User.find_by_email(email)
    if not user:
        return jsonify({'error': 'User with this email does not exist'}), 404

    # Create token doc in DB
    raw_token = PasswordResetToken.create_token_for_email(email, ttl_minutes=30)

    # Email the user
    reset_link = url_for('resetPassword.reset_password_token', token=raw_token, _external=True)
    msg = Message(
        subject="Password Reset Request",
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=[email],
        body=f"Click the link to reset your password: {reset_link}"
    )
    mail.send(msg)

    return jsonify({'message': 'Password reset email sent!'}), 200

@resetPassword_bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password_token(token):
    """2) User clicks link with the token to reset password (GET or POST)."""
    # Find the reset doc. If invalid or expired, return an error
    reset_doc = PasswordResetToken.validate_token(token)
    if not reset_doc:
        return jsonify({"error": "Invalid or expired token"}), 400

    if request.method == 'GET':
        # Render a page to allow the user to input the new password
        return render_template('reset_password_form.html', token=token)

    if request.method == 'POST':
        # Get the new password from the form
        new_password = request.form.get('password')
        if not new_password:
            return jsonify({'error': 'Password is required'}), 400

        # Look up user by email
        user = User.find_by_email(reset_doc["email"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Update the user's password
        User.update_password(user['_id'], new_password)

        # Mark the token as used
        PasswordResetToken.mark_used(reset_doc["_id"])

        return jsonify({'message': 'Password has been reset successfully'}), 200
