from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from twilio.rest import Client
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Twilio configuration
TWILIO_ACCOUNT_SID = 'your_account_sid'
TWILIO_AUTH_TOKEN = 'your_auth_token'
TWILIO_VERIFICATION_SERVICE_SID = 'your_verification_service_sid'

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Model definition
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    family_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.phone_number}>'

# Initialize the database
db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    phone_number = data.get('phone_number')
    name = data.get('name')
    family_name = data.get('family_name')
    email = data.get('email')

    if not phone_number or not name or not family_name or not email:
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter_by(phone_number=phone_number).first():
        return jsonify({'error': 'Phone number already exists'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(phone_number=phone_number, name=name, family_name=family_name, email=email)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully!', 'phone_number': phone_number})

@app.route('/send-code', methods=['POST'])
def send_code():
    data = request.json
    phone_number = data.get('phone_number')

    if not phone_number:
        return jsonify({'error': 'Phone number is required'}), 400

    try:
        client.verify.services(TWILIO_VERIFICATION_SERVICE_SID).verifications.create(to=phone_number, channel='sms')
        return jsonify({'message': 'Verification code sent'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.json
    phone_number = data.get('phone_number')
    code = data.get('code')

    if not phone_number or not code:
        return jsonify({'error': 'Phone number and code are required'}), 400

    try:
        verification_check = client.verify.services(TWILIO_VERIFICATION_SERVICE_SID).verification_checks.create(to=phone_number, code=code)
        if verification_check.status == 'approved':
            return jsonify({'verified': True}), 200
        else:
            return jsonify({'verified': False}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
