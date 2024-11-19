from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
import pandas as pd
import logging
from extensions import mongo
from models import Category, Item
from services.category_service import update_categories_from_excel

categories_bp = Blueprint('categories', __name__)

logger = logging.getLogger(__name__)


# Route to update categories from an Excel file
@categories_bp.route('/update_categories', methods=['POST'])
def update_categories():
    update_categories_from_excel()
    return jsonify({"message": "Categories processed successfully"}), 200

@categories_bp.route('/types', methods=['GET'])
def get_category_types():
    try:
        types = Category.get_unique_types()
        if not types:
            logger.warning("No types found in database.")
            return jsonify({"error": "No types found"}), 404
        logger.info("Types fetched successfully: %s", types)
        return jsonify({"types": types}), 200
    except Exception as e:
        logger.error(f"Error fetching types: {e}")
        return jsonify({"error": "Failed to fetch types"}), 500

@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    category_type = request.args.get('type')  # Get the 'type' parameter from the query string
    try:
        if category_type:
            # Fetch categories filtered by the specified type
            categories = Category.get_by_type(category_type)
            if not categories:
                logger.warning(f"No categories found for type: {category_type}")
                return jsonify({"error": f"No categories found for type: {category_type}"}), 404
            logger.info(f"Categories fetched successfully for type '{category_type}': {categories}")
        else:
            # Fetch all categories if no type is specified
            categories = Category.get_all()
            if not categories:
                logger.warning("No categories found in database.")
                return jsonify({"error": "No categories found"}), 404
            logger.info("Categories fetched successfully: %s", categories)

        return jsonify({"categories": categories}), 200

    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        return jsonify({"error": "Failed to fetch categories"}), 500




# Flask route to create a new category
@categories_bp.route('/create', methods=['POST'])
def create_category():
    data = request.json
    sortGroup = data.get('sortGroup')
    name = data.get('name')
    description = data.get('description', '')
    
    # Create a new category
    category_id = Category.create_category(sortGroup, name, description)
    return jsonify({"message": "Category created", "id": str(category_id)}), 201

# Flask route to update a category by sortGroup
@categories_bp.route('/update/<sortGroup>', methods=['PUT'])
def update_category(sortGroup):
    data = request.json
    result = Category.update_category(sortGroup, data)
    
    if result > 0:
        return jsonify({"message": "Category updated successfully"}), 200
    else:
        return jsonify({"message": "No category found with the provided SortGroup"}), 404

# Flask route to delete a category by sortGroup
@categories_bp.route('/delete/<sortGroup>', methods=['DELETE'])
def delete_category(sortGroup):
    result = Category.delete_category(sortGroup)
    
    if result > 0:
        return jsonify({"message": "Category deleted successfully"}), 200
    else:
        return jsonify({"message": "No category found with the provided SortGroup"}), 404