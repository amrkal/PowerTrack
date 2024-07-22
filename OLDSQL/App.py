from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from config import Config
from routes import auth_bp, items_bp, users_bp

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(items_bp, url_prefix='/items')
app.register_blueprint(users_bp, url_prefix='/users')

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Server is running'})

if __name__ == '__main__':
    app.run(debug=True, host='192.168.0.153', port=5000)
