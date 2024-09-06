# models.py
import re
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from flask_sqlalchemy import SQLAlchemy

# Load the MONGO_URI from the Config class
client = MongoClient(Config.MONGO_URI)
db_mongo = client['PowerTrack']

# SQLAlchemy instance for SQL database
db_sql = SQLAlchemy()

class User:
    @staticmethod
    def find_by_username(username):
        return db_mongo.users.find_one({'username': username})

    @staticmethod
    def find_by_phone_number(phone_number):
        return db_mongo.users.find_one({'phone_number': phone_number})

    @staticmethod
    def find_by_email(email):
        return db_mongo.users.find_one({'email': email})

    @staticmethod
    def update_password(user_id, new_password):
        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
        return db_mongo.db.users.update_one({'_id': user_id}, {'$set': {'password': hashed_password}})

    @staticmethod
    def create_user(username, password, phone_number, name, family_name, email):
        try:
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
            user_data = {
                'username': username,
                'password': hashed_password,
                'phone_number': phone_number,
                'name': name,
                'family_name': family_name,
                'email': email,
                'is_approved': True
            }
            db_mongo.users.insert_one(user_data)  # Insert into MongoDB
            print(f"User {username} created successfully")
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            raise  # Re-raise the exception to handle it in the calling function
    @staticmethod
    def approve_user(username):
        db_mongo.users.update_one({'username': username}, {'$set': {'is_approved': True}})


class Category:
    @staticmethod
    def get_all():
        return list(db_mongo.categories.find({}, {"_id": 0, "name": 1}))  # Only retrieve the 'name' field


class Item:
    @staticmethod
    def get_all():
        # Regular expression to match the pattern "**-***"
        pattern = r'^\d{2}-\d{3}$'
        return list(db_mongo.items.find({"ItemKey": {"$regex": pattern}}))


    @staticmethod
    def get_paginated(skip, limit):
        pattern = r'^\d{2}-\d{3}$'
        return list(db_mongo.items.find({"ItemKey": {"$regex": pattern}}).skip(skip).limit(limit))

    @staticmethod
    def count_all():
        return db_mongo.items.count_documents({})

    @staticmethod
    def create_item(data):
        return db_mongo.items.insert_one(data)

    @staticmethod
    def find_by_id(item_id):
        return db_mongo.items.find_one({"_id": item_id})

    @staticmethod
    def update_item(item_id, data):
        return db_mongo.items.update_one({"_id": item_id}, {"$set": data})

    @staticmethod
    def delete_item(item_id):
        return db_mongo.items.delete_one({"_id": item_id})
    