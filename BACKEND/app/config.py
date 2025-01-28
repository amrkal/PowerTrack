import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')  # If SECRET_KEY is not found, use the default
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/defaultdb')
    MONGO_DBNAME = os.getenv('MONGO_DBNAME', 'defaultdb')

    # Flask-Mail configuration
    MAIL_SERVER = 'smtp.office365.com'  # For Gmail: 'smtp.gmail.com', For HostGator: 'mail.yourdomain.com'
    MAIL_PORT = 587  # 465 for SSL, 587 for TLS
    MAIL_USE_TLS = True  # Use TLS if you're using port 587
    MAIL_USE_SSL = False  # Use SSL for port 465
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')  # This will fetch from .env
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')  # This will fetch from .env
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')  # This will fetch from .env

    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')  # This will fetch from .env
    JWT_TOKEN_LOCATION = ['headers']  # JWT token will be passed in headers
