import os
from flask import Blueprint, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
import pandas as pd
import logging
from app.extensions import mongo
from app.models import Category, Item
from app.services.category_service import update_categories_from_excel

categories_bp = Blueprint('categories', __name__)

logger = logging.getLogger(__name__)

IMAGE_FOLDER = os.path.abspath("./converted_images")

@categories_bp.route('/images/<filename>')
def serve_category_image(filename):
    """ Serve category images from the converted_images folder """

    # Ensure the file actually exists before serving it
    file_path = os.path.join(IMAGE_FOLDER, filename)
    
    if not os.path.exists(file_path):
        return jsonify({"error": f"Image {filename} not found in {IMAGE_FOLDER}"}), 404
    
    return send_from_directory(IMAGE_FOLDER, filename)



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
        # logger.info("Types fetched successfully: %s", types)
        return jsonify({"types": types}), 200
    except Exception as e:
        logger.error(f"Error fetching types: {e}")
        return jsonify({"error": "Failed to fetch types"}), 500


@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    """ Fetch categories and return them with full image URLs """
    try:
        categories = Category.get_all()
        if not categories:
            return jsonify({"error": "No categories found"}), 404

        # Ensure base_url is defined correctly
        base_url = request.host_url if request else "http://localhost:5000/"

        # Add full URL for images
        for category in categories:
            if category.get("image"):  # If image exists, build full URL
                category["image"] = f"{base_url}categories/images/{os.path.basename(category['image'])}"

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
    image = data.get('image', '')  # Accept image from request
    
    # Create a new category
    category_id = Category.create_category(sortGroup, name, description,image)
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