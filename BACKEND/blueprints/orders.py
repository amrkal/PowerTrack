from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from datetime import datetime
from models import Order
from flask_jwt_extended import jwt_required, get_jwt_identity

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()  # Fetch the user's ID from the JWT token
        data = request.json
        print(f"Request data: {data}")  # Add this line for debugging

        # Extract order details from the request
        items = data.get('items')
        total_amount = data.get('total_amount')

        if not items or not total_amount:
            return jsonify({"error": "Items and total amount are required"}), 400  # This is the cause of 400 error

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
