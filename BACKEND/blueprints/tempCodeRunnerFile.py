# @items_bp.route('/items', methods=['GET'])
# # # def get_items():
# # #     try:
# # #         # Get page and limit from query parameters, with default values
# # #         page = int(request.args.get('page', 1))
# # #         limit = int(request.args.get('limit', 20))
# # #         PriceListNumber = request.args.get('prices_tag', type=int)  # Retrieve the prices_tag sent by the frontend
        
# # #         skip = (page - 1) * limit

# # #         # Fetch paginated items
# # #         items = Item.get_paginated(skip, limit)

# # #         # Prepare response data
# # #         response_data = {
# # #             'items': [],
# # #             'page': page,
# # #             'limit': limit,
# # #             'hasMore': True,
# # #         }

# # #         # For each item, fetch its price using the get_price_by_item_and_tag method
# # #         for item in items:
# # #             price = Item.get_price_by_item_and_tag(item['ItemKey'], PriceListNumber)  # Fetch the correct price
# # #             response_data['items'].append({
# # #                 'id': str(item['_id']),
# # #                 'item_key': item.get('ItemKey'),
# # #                 'item_name': item.get('ItemName'),
# # #                 'description': item.get('description', ''),
# # #                 'price': price,  # Use the fetched price
# # #                 'purch_price': item.get('PurchPrice', 0),
# # #                 'quantity': item.get('Quantity', 0),
# # #                 'discount_code': item.get('DiscountCode', '')
# # #             })
        
# # #         return jsonify(response_data)
    
# # #     except Exception as e:
# # #         print(f"Error fetching items: {e}")
# # #         return jsonify({'error': 'An internal server error occurred'}), 500