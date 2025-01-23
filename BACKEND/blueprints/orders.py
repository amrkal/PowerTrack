from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from datetime import datetime
from models import Item, Order ,Returns
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from models import User  # Adjust the import based on your project structure
from flask import current_app as app
from extensions import mail  # Import mail from app's extensions


orders_bp = Blueprint('orders', __name__)

# Initialize mail (you can add this to your app setup)

@orders_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()  # Fetch the user's ID from the JWT token
        data = request.json
        print(f"Request data: {data}")  # Debugging

        # Extract order details from the request
        items = data.get('items')
        total_amount = data.get('total_amount')

        if not items:
            return jsonify({"error": "'items' field is required"}), 400

        if not total_amount:
            return jsonify({"error": "'total_amount' field is required"}), 400

        # Validate each item
        for item in items:
            item_id = item.get('id')
            quantity_purchased = item.get('quantity')

            if not item_id or quantity_purchased is None:
                return jsonify({"error": "Each item must have an ID and quantity"}), 400

            if not isinstance(quantity_purchased, int) or quantity_purchased <= 0:
                return jsonify({"error": "Quantity must be a positive integer"}), 400

            # Fetch the item from the database
            db_item = Item.find_by_id(ObjectId(item_id))
            print(f"Database item: {db_item}")  # Debugging

            if not db_item:
                return jsonify({"error": f"Item with ID {item_id} not found"}), 404

            # Allow negative stock levels
            current_quantity = db_item.get('Quantity', 0)
            new_quantity = current_quantity - quantity_purchased
            print(f"Updating item ID {item_id} with new quantity {new_quantity}")  # Debugging
            
            # Update stock level
            update_result = Item.update_item_quantity(item_id, new_quantity)
            if update_result.modified_count == 0:
                return jsonify({"error": f"Failed to update stock for item ID {item_id}"}), 500

        # Create the order
        order = {
            "user_id": ObjectId(user_id),
            "items": items,
            "total_amount": total_amount,
            "order_status": "pending",
            "order_date": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        order_id = Order.create_order(user_id=user_id, items=items, total_amount=total_amount).inserted_id

        # Send email to user after order is created
        user = User.find_by_id(user_id)
        user_email = user.get('email')
        send_order_email(user_email, items, total_amount)

        return jsonify({"message": "Order created", "order_id": str(order_id)}), 201

    except Exception as e:
        print(f"Error occurred: {e}")  # Debugging
        return jsonify({"error": str(e)}), 500
    

def send_order_email(user_email, items, total_amount):
    try:
        subject = "Order Confirmation"
        message_body = f"Thank you for your order!\n\nHere are the details:\n\nItems Ordered:\n"

        for item in items:
            message_body += f"- {item['name']} (Quantity: {item['quantity']})\n"

        message_body += f"\nTotal Amount: {total_amount}"

        msg = Message(subject,
                      recipients=[user_email, app.config['MAIL_USERNAME']],  # Send to both user and admin email
                      body=message_body)
        mail.send(msg)

        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")





# @orders_bp.route('/orders', methods=['POST'])
# @jwt_required()
# def create_order():
#     try:
#         user_id = get_jwt_identity()  # Fetch the user's ID from the JWT token
#         data = request.json
#         print(f"Request data: {data}")  # Debugging

#         # Extract order details from the request
#         items = data.get('items')
#         total_amount = data.get('total_amount')

#         if not items:
#             return jsonify({"error": "Items and total amount are required"}), 400

#         # Validate each item
#         for item in items:
#             item_id = item.get('id')
#             quantity_purchased = item.get('quantity')

#             if not item_id or quantity_purchased is None:
#                 return jsonify({"error": "Each item must have an ID and quantity"}), 400

#             if not isinstance(quantity_purchased, int) or quantity_purchased <= 0:
#                 return jsonify({"error": "Quantity must be a positive integer"}), 400

#             # Fetch the item from the database
#             db_item = Item.find_by_id(ObjectId(item_id))
#             print(f"Database item: {db_item}")  # Debugging

#             if not db_item:
#                 return jsonify({"error": f"Item with ID {item_id} not found"}), 404

#             # Allow negative stock levels
#             current_quantity = db_item.get('Quantity', 0)
#             new_quantity = current_quantity - quantity_purchased
#             print(f"Updating item ID {item_id} with new quantity {new_quantity}")  # Debugging
            
#             # Update stock level
#             update_result = Item.update_item_quantity(item_id, new_quantity)
#             if update_result.modified_count == 0:
#                 return jsonify({"error": f"Failed to update stock for item ID {item_id}"}), 500

#         # Create the order
#         order = {
#             "user_id": ObjectId(user_id),
#             "items": items,
#             "total_amount": total_amount,
#             "order_status": "pending",
#             "order_date": datetime.utcnow(),
#             "updated_at": datetime.utcnow()
#         }
#         order_id = Order.create_order(user_id=user_id, items=items, total_amount=total_amount).inserted_id
#         return jsonify({"message": "Order created", "order_id": str(order_id)}), 201

#     except Exception as e:
#         print(f"Error occurred: {e}")  # Debugging
#         return jsonify({"error": str(e)}), 500



@orders_bp.route('/history', methods=['GET'])
@jwt_required()  # Require JWT for accessing order history
def get_order_history():
    try:
        user_id = get_jwt_identity()  # Get the user's ID from the JWT token
        print(f"Looking up orders for user_id: {user_id}")

        # Fetch the user's orders from the database using the user_id
        orders = Order.find_by_user_id(user_id)
        print(f"Fetched orders: {orders}")

        if not orders:
            print("No orders found.")
            return jsonify({"orders": []}), 200

        # Format the orders into a list of dictionaries without `order_id`
        order_list = [
            {
                "order_number": order.get("order_number", "N/A"),
                "items": order["items"],
                "total_amount": order["total_amount"],
                "order_status": order["order_status"],
                "order_date": order["order_date"].strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": order["updated_at"].strftime("%Y-%m-%d %H:%M:%S")
            } for order in orders
        ]

        print(f"Formatted orders: {order_list}")
        return jsonify({"orders": order_list}), 200
    except Exception as e:
        print(f"Error fetching order history: {str(e)}")
        return jsonify({"error": str(e)}), 500


    

@orders_bp.route('/<order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        data = request.json
        new_status = data.get("order_status")

        if new_status not in ["pending", "completed", "cancelled"]:
            return jsonify({"error": "Invalid order status"}), 400

        # Update the order status
        result = Order.update_order_status(
            {"_id": ObjectId(order_id)},
            {"$set": {"order_status": new_status, "updated_at": datetime.utcnow()}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Order not found"}), 404

        return jsonify({"message": "Order status updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    







@orders_bp.route('/returns', methods=['GET'])
@jwt_required()
def get_returnable_items():
    try:
        user_id = get_jwt_identity()  # Get the user's ID from the JWT token
        orders = Order.find_by_user_id(user_id)  # Fetch user orders

        if not orders:
            return jsonify({"returnable_items": []}), 200

        # Define return eligibility (e.g., within 30 days)
        return_window_days = 30
        now = datetime.utcnow()

        returnable_items = []
        for order in orders:
            for item in order['items']:
                purchase_date = order['order_date']
                if (now - purchase_date).days <= return_window_days:
                    returnable_items.append({
                        "order_id": str(order["_id"]),
                        "item_id": item['id'],
                        "item_name": item.get('item_name'),
                        "quantity": item.get('quantity'),
                        "purchase_date": purchase_date.strftime("%Y-%m-%d %H:%M:%S"),
                    })

        return jsonify({"returnable_items": returnable_items}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@orders_bp.route('/returns', methods=['POST'])
@jwt_required()
def initiate_return():
    try:
        user_id = get_jwt_identity()
        data = request.json

        order_id = data.get("order_id")
        item_id = data.get("item_id")
        quantity_to_return = data.get("quantity_to_return")
        return_reason = data.get("return_reason")

        # Validate required fields
        if not order_id or not item_id or not quantity_to_return or not return_reason:
            return jsonify({"error": "Order ID, Item ID, Quantity to Return, and Return Reason are required"}), 400

        if not isinstance(quantity_to_return, int) or quantity_to_return <= 0:
            return jsonify({"error": "Quantity to return must be a positive integer"}), 400

        # Fetch the order to ensure it belongs to the user
        order = Order.find_by_id(order_id)
        if not order or str(order["user_id"]) != user_id:
            return jsonify({"error": "Order not found or access denied"}), 404

        # Ensure the item exists in the order
        item = next((i for i in order["items"] if i["id"] == item_id), None)
        if not item:
            return jsonify({"error": "Item not found in order"}), 404

        # Check if the quantity to return is valid
        available_quantity = item.get("quantity", 0)
        if quantity_to_return > available_quantity:
            return jsonify({"error": f"Cannot return more than {available_quantity} units of this item"}), 400

        # Create the return request
        return_id = Returns.create_return_request(
            user_id=user_id,
            order_id=order_id,
            item_id=item_id,
            return_reason=return_reason,
            quantity_to_return=quantity_to_return
        )

        return jsonify({"message": "Return request created", "return_id": return_id}), 201
    except Exception as e:
        print(f"Error in initiate_return: {e}")  # Log the error for debugging
        return jsonify({"error": str(e)}), 500



@orders_bp.route('/returns/history', methods=['GET'])
@jwt_required()
def get_return_history():
    try:
        user_id = get_jwt_identity()
        return_requests = Returns.find({"user_id": ObjectId(user_id)})

        return_list = [
            {
                "return_id": str(r["_id"]),
                "order_id": str(r["order_id"]),
                "item_id": r["item_id"],
                "return_reason": r["return_reason"],
                "status": r["status"],
                "created_at": r["created_at"].strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": r["updated_at"].strftime("%Y-%m-%d %H:%M:%S"),
            }
            for r in return_requests
        ]

        return jsonify({"returns": return_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
