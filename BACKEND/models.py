# models.py
from datetime import datetime
import re
from bson import ObjectId
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
        print(f"new_password = {new_password}")
        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
        return db_mongo.users.update_one({'_id': user_id}, {'$set': {'password': hashed_password}})

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
                'prices_tag': 5,
                'role': 'user',
                'is_approved': True,
                'suspend': False,
                'city': 'majdal shams',
                'zip_code': 1243800,
                'address': 'majdal shams',
                'secound_phone_number': 0,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
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
    
    @staticmethod
    def get_price_by_item_and_tag(item_key, PriceListNumber):
        # Step 1: Check the prices collection for the most recent price based on ItemKey and PriceListNumber
        price_data = db_mongo.PriceLists.find_one(
            {
                'ItemKey': item_key,
                'PriceListNumber': PriceListNumber
            },
            sort=[('DatF', -1)]  # Sort by DatF in descending order to get the most recent price
        )

        if price_data and 'Price' in price_data:
            return price_data['Price']  # Return the most recent price if found

        # Step 2: If no adjusted price is found, fallback to the price in the items collection
        item_data = db_mongo.items.find_one({'ItemKey': item_key})
        if item_data and 'Price' in item_data:
            return item_data['Price']  # Return the original item price if found

        # Step 3: Return 0 if no price is found at all
        return 0




class Order:
    @staticmethod
    def find(filter_criteria):
        return db_mongo.orders.find(filter_criteria)

    @staticmethod
    def create_order(user_id, items, total_amount):
        order = {
            "user_id": ObjectId(user_id),  # Convert user_id to ObjectId
            "items": items,  # Pass items from request
            "total_amount": total_amount,  # Pass total amount from request
            "order_status": "pending",
            "order_date": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        return db_mongo.orders.insert_one(order)

    @staticmethod
    def find_by_user_id(user_id):
        return list(db_mongo.orders.find({"user_id": ObjectId(user_id)}))  # Convert to ObjectId and list

    @staticmethod
    def get_order_history(user_id):
        orders = db_mongo.orders.find({"user_id": ObjectId(user_id)})  # Ensure ObjectId is used
        order_list = []
        for order in orders:
            order_list.append({
                "order_id": str(order["_id"]),
                "items": order["items"],
                "total_amount": order["total_amount"],
                "order_status": order["order_status"],
                "order_date": order["order_date"],
                "updated_at": order["updated_at"]
            })
        return order_list

    @staticmethod
    def update_order_status(order_id, new_status):
        return db_mongo.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"order_status": new_status}})

    @staticmethod
    def delete_order(order_id):
        return db_mongo.orders.delete_one({"_id": ObjectId(order_id)})

    @staticmethod
    def get_all_orders():
        return list(db_mongo.orders.find({}))