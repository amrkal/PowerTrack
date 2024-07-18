from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

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

if __name__ == '__main__':
    app.run(debug=True)
