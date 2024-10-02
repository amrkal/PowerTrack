class Config:
    SECRET_KEY = 'b0315c6e96e72f099c5929557c4af90d868f4a344bfcf0ee97c75a5fa58ca098'
    MONGO_URI = 'mongodb://amrkal:124487@localhost:27017/PowerTrack?authSource=admin&authMechanism=SCRAM-SHA-256'
    MONGO_DBNAME = 'PowerTrack'



    # Flask-Mail configuration
    MAIL_SERVER = 'smtp.office365.com'  # For Gmail: 'smtp.gmail.com', For HostGator: 'mail.yourdomain.com'
    MAIL_PORT = 587  # 465 for SSL, 587 for TLS
    MAIL_USE_TLS = True  # Use TLS if you're using port 587
    MAIL_USE_SSL = False  # Use SSL for port 465
    MAIL_USERNAME = 'HashmalHarma@hotmail.com'  # Replace with your actual Hotmail address
    MAIL_PASSWORD = '124487Noobs'  # Replace with your actual Hotmail password
    MAIL_DEFAULT_SENDER = 'HashmalHarma@hotmail.com'  # Match this with MAIL_USERNAME


    # JWT configuration
    JWT_SECRET_KEY = 'your-jwt-secret-key'  # Replace this with a strong secret key
    JWT_TOKEN_LOCATION = ['headers']  # JWT token will be passed in headers
