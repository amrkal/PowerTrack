from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config

# Load the MONGO_URI from the Config class
client = MongoClient(Config.MONGO_URI)
db_name = "PowerTrack"
db = client[db_name]

class User:
    @staticmethod
    def find_by_username(username):
        return db.users.find_one({'username': username})

    @staticmethod
    def find_by_phone_number(phone_number):
        return db.users.find_one({'phone_number': phone_number})

    @staticmethod
    def find_by_email(email):
        return db.users.find_one({'email': email})

    @staticmethod
    def create_user(data):
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        user_data = {
            'username': data['username'],
            'password': hashed_password,
            'phone_number': data['phone_number'],
            'name': data['name'],
            'family_name': data['family_name'],
            'email': data['email'],
            'is_approved': True
        }
        db.users.insert_one(user_data)

    @staticmethod
    def approve_user(username):
        db.users.update_one({'username': username}, {'$set': {'is_approved': True}})

class Category:
    @staticmethod
    def get_all():
        return db.categories.find()

class Item:
    @staticmethod
    def get_all():
        return db.items.find()
