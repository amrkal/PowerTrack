from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from datetime import datetime
from models import Item, Order
from flask_jwt_extended import jwt_required, get_jwt_identity

orders_bp = Blueprint('orders', __name__)

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

        if not items or not total_amount:
            return jsonify({"error": "Items and total amount are required"}), 400

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
        return jsonify({"message": "Order created", "order_id": str(order_id)}), 201

    except Exception as e:
        print(f"Error occurred: {e}")  # Debugging
        return jsonify({"error": str(e)}), 500



@orders_bp.route('/history', methods=['GET'])
@jwt_required()  # Require JWT for accessing order history
def get_order_history():
    try:
        user_id = get_jwt_identity()  # Get the user's ID from the JWT token
        print(f"Looking up orders for user_id: {user_id}")
        # Fetch the user's orders from the database using the user_id
        orders = Order.find_by_user_id(user_id)
        print(f'Your orders are: {orders}')  # Add this line for debugging
        # Format the orders into a list of dictionaries to send them as a response
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

        return jsonify({"orders": order_list}), 200  # Send the order list as a response
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle errors
    

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
