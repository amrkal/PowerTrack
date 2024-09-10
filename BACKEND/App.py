from flask import Flask
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pymongo.errors
from flask_mail import Mail, Message
from config import Config
from extensions import mail,mongo



# Create Flask app instance
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Flask app with settings from Config
app.config.from_object(Config)

# Debugging: Print the MONGO_URI to verify it is being loaded
print(f"MONGO_URI: {app.config['MONGO_URI']}")


    # Initialize extensions
mongo.init_app(app)
mail.init_app(app)

jwt = JWTManager(app)

# # Initialize PyMongo
# mail = Mail(app)
# mongo = PyMongo(app)

# Register Blueprints
from blueprints.auth import auth_bp
from blueprints.items import items_bp
from blueprints.users import users_bp
from blueprints.resetPassword import resetPassword_bp
from blueprints.orders import orders_bp
from blueprints.admin import admin

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(items_bp, url_prefix='/items')
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(resetPassword_bp, url_prefix='/resetPassword')
app.register_blueprint(orders_bp, url_prefix='/orders')
app.register_blueprint(admin, url_prefix='/admin')  # Your admin routes

# Define a test route to check if app is working
@app.route('/')
def index():
    return "Hello, Flask app is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
