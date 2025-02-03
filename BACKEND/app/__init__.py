from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import logging
import os
from app.services.category_service import update_categories_from_excel
from app.extensions import mail, mongo
from pymongo import MongoClient


# Load environment variables
load_dotenv()


# Create Flask app instance
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Flask app with settings from Config
app.config.from_object('app.config.Config')

# Logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize extensions
mongo.init_app(app)
mail.init_app(app)


# Initialize JWT
jwt = JWTManager(app)


UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Register Blueprints
from app.blueprints.auth import auth_bp
from app.blueprints.items import items_bp
from app.blueprints.users import users_bp
from app.blueprints.resetPassword import resetPassword_bp
from app.blueprints.orders import orders_bp
from app.blueprints.categories import categories_bp  # Blueprint where update logic is


app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(items_bp, url_prefix='/items')
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(resetPassword_bp, url_prefix='/resetPassword')
app.register_blueprint(orders_bp, url_prefix='/orders')
app.register_blueprint(categories_bp, url_prefix='/categories')  # Corrected URL prefix

@app.route('/privacy-policy', methods=['GET'])
def get_privacy_policy():
    return jsonify({"policy": "This is your app's privacy policy content."})

# Call the function to update categories from Excel at app startup
def create_app():
    # Initialize any other app configurations or extensions here
    with app.app_context():  # Ensure it runs inside an app context
        update_categories_from_excel()
    return app


# Define a test route to check if app is working
@app.route('/')
def index():
    return "Hello, Flask app is running!"

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')
