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
    def find_by_id(user_id):
        return db_mongo.users.find_one({'_id': ObjectId(user_id)})
    
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
    def update_user(user_id, data):
        db_mongo.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'name': data['name'],
                'family_name': data['familyName'],
                'email': data['email'],
                'city': data['city'],
                'zip_code': data['zip_code'],
                'address': data['address']
            }}
        )
    

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
        """ Retrieve all categories with pagination support """
        return list(db_mongo.categories.find({}, {"_id": 0, "sortGroup": 1, "globalCategory": 1,"name": 1}))

    @staticmethod
    def create_category(sortGroup, name, description=None):
        """ Create a new category """
        try:
            category_data = {
                'sortGroup': sortGroup,
                'name': name,
                'description': description if description else '',
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow(),
                'status': 'active'  # Default status is active
            }
            return db_mongo.categories.insert_one(category_data).inserted_id
        except Exception as e:
            print(f"Error creating category: {str(e)}")
            raise

    @staticmethod
    def update_category(sortGroup, updated_data):
        """ Update an existing category """
        updated_data['updatedAt'] = datetime.utcnow()  # Update timestamp
        result = db_mongo.categories.update_one(
            {'sortGroup': sortGroup}, 
            {'$set': updated_data}
        )
        return result.modified_count

    @staticmethod
    def delete_category(sortGroup):
        """ Delete a category by its sortGroup """
        result = db_mongo.categories.delete_one({'sortGroup': sortGroup})
        return result.deleted_count

    @staticmethod
    def get_category_by_sortGroup(sortGroup):
        """ Find a category by its sortGroup """
        return db_mongo.categories.find_one({'sortGroup': sortGroup}, {"_id": 0, "sortGroup": 1, "name": 1, "description": 1})

    @staticmethod
    def deactivate_category(sortGroup):
        """ Set a category status to 'archived' """
        return db_mongo.categories.update_one(
            {'sortGroup': sortGroup},
            {'$set': {'status': 'archived', 'updatedAt': datetime.utcnow()}}
        )

class Item:
    @staticmethod
    def get_all():
        # Regular expression to match the pattern "**-***"
        pattern = r'^\d{2}-\d{3}$'
        return list(db_mongo.items.find({"ItemKey": {"$regex": pattern}}))

    @staticmethod
    def get_all_items_by_category(sortGroup):
        """Fetch all items belonging to a specific category by sortGroup"""
        sortGroup = (int(sortGroup))
        try:
            # Query MongoDB to find items by the category's sortGroup
            items = list(db_mongo.items.find(
                {"SortGroup": sortGroup}, 
                {
                    "_id": 1,  # We need _id to convert to string later
                    "ItemKey": 1,
                    "ItemName": 1,
                    "description": 1,
                    "Quantity": 1,
                    "SortGroup": 1,
                    "Price": 1
                }
            ))

            # Modify each item before returning
            formatted_items = [
                {
                    'id': str(item['_id']),
                    'item_key': item.get('ItemKey'),
                    'item_name': item.get('ItemName'),
                    'description': item.get('description', ''),
                    'price': item.get('Price', 0),  # Fetch price
                    'quantity': item.get('Quantity', 0),
                    'sortGroup': item.get('SortGroup', 'others')
                }
                for item in items
            ]
            
            return formatted_items
        except Exception as e:
            print(f"Error fetching items for sortGroup {sortGroup}: {str(e)}")
            return []


    @staticmethod
    def get_all_items_by_category_price(sortGroup, PriceListNumber):
        """Fetch all items belonging to a specific category by sortGroup"""
        sortGroup = (int(sortGroup))
        try:
            # Query MongoDB to find items by the category's sortGroup
            items = list(db_mongo.items.find(
                {"SortGroup": sortGroup}, 
                {
                    "_id": 1,  # We need _id to convert to string later
                    "ItemKey": 1,
                    "ItemName": 1,
                    "description": 1,
                    "Quantity": 1,
                    "SortGroup": 1
                }
            ))

            # Modify each item before returning
            formatted_items = [
                {
                    'id': str(item['_id']),
                    'item_key': item.get('ItemKey'),
                    'item_name': item.get('ItemName'),
                    'description': item.get('description', ''),
                    'price': Item.get_price_by_item_and_tag(item.get('ItemKey'), PriceListNumber),  # Fetch price
                    'quantity': item.get('Quantity', 0),
                    'sortGroup': item.get('SortGroup', 'others')
                }
                for item in items
            ]
            
            return formatted_items
        except Exception as e:
            print(f"Error fetching items for sortGroup {sortGroup}: {str(e)}")
            return []

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


        

    @staticmethod
    def search(query, limit=50):

        # Escape special characters in the query
        escaped_query = re.escape(query)

        # Build a case-insensitive regex for the search query
        search_regex = {'$regex': escaped_query, '$options': 'i'}

        # Create the query to search both ItemKey and ItemName
        search_query = {
            '$or': [
                {'ItemKey': search_regex},
                {'ItemName': search_regex}
            ]
        }

        # Execute the query with a limit
        return list(db_mongo.items.find(search_query).limit(limit))
    

    @staticmethod
    def get_unique_sort_groups():
        # Use aggregation to get unique SortGroup values
        pipeline = [
            {
                '$group': {
                    '_id': '$SortGroup',
                }
            },
            {
                '$sort': {'_id': 1}  # Sort categories alphabetically
            }
        ]
        categories = list(db_mongo.items.aggregate(pipeline))

        # Convert to a list of dictionaries with 'id' and 'name' keys
        categories_list = [{'id': c['_id'], 'name': c['_id']} for c in categories if c['_id']]

        # Add 'All' and 'View All' categories manually
        categories_list.insert(0, {'id': 'all', 'name': 'All'})

        return categories_list




    @staticmethod
    def get_total_count(query):
        return db_mongo.items.count_documents(query)

    @staticmethod
    def get_paginated(skip, limit, query):
        return list(db_mongo.items.find(query).skip(skip).limit(limit))

    # @staticmethod
    # def get_paginated(skip, limit):
    #     pattern = r'^\d{2}-\d{3}$'
    #     return list(db_mongo.items.find({"ItemKey": {"$regex": pattern}}).skip(skip).limit(limit))

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
        result = db_mongo.items.update_one({"_id": item_id}, {"$set": {'Qunatity': data['Quantity']}})
        return result
    
    @staticmethod
    def update_item_quantity(item_id, quantity):
        if quantity is None:
            raise ValueError("Quantity key is missing in the data")
        
        # Ensure quantity is an integer
        if not isinstance(quantity, int):
            try:
                quantity = int(quantity)
            except ValueError:
                raise ValueError("Quantity must be an integer value")

        # Perform the update
        try:
            result = db_mongo.items.update_one({"_id": ObjectId(item_id)}, {"$set": {'Quantity': quantity}})
            if result.matched_count == 0:
                raise ValueError("Item not found")
            return result
        except Exception as e:
            print("Error occurred:", e)
            raise



    @staticmethod
    def delete_item(item_id):
        return db_mongo.items.delete_one({"_id": item_id})
    




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