# def update_categories_from_excel():
#     # 1. Fetch distinct SortGroups from the items collection
#     distinct_sort_groups = mongo.db.items.distinct("SortGroup")
#     # logger.info(f"Distinct SortGroups from items: {distinct_sort_groups}")

#     # 2. Load the mapping from the Excel file
#     file_path = './Groups.xlsx'  # Use the updated Excel file
#     data = pd.read_excel(file_path)
#     data.columns = data.columns.str.strip()  # Strip any extra spaces

#     # Log the column names to verify that they are correct
#     #logger.info(f"Excel columns: {data.columns.tolist()}")



#     # Convert Excel data to dictionary with SortGroup as key, and include 'Type'
#     sort_group_mapping = {
#         row["SortGroup"]: {
#             "category_name": row["CategoryName"],
#             "global_category_name": row.get("GlobalCategoryName", ""),
#             "type": row.get("Type", "Other")  # Fetch the Type or default to "Other"
#         }
#         for _, row in data.iterrows()
#     }

#     # Log the mapping to ensure it's processed correctly
#     #logger.info(f"Sort Group Mapping: {sort_group_mapping}")

#     # 3. Insert or update categories in the categories collection
#     categories_collection = mongo.db.categories  # Define the collection

#     for sort_group in distinct_sort_groups:
#         # Check if the SortGroup exists in the mapping
#         if sort_group in sort_group_mapping:
#             category_info = sort_group_mapping[sort_group]
#             category_name = category_info["category_name"]
#             global_category_name = category_info["global_category_name"]
#             category_type = category_info["type"]  # Get the 'Type' field

#             # Log each category update attempt
#             #logger.info(f"Processing SortGroup: {sort_group}, Category: {category_name}, GlobalCategory: {global_category_name}, Type: {category_type}")

#             # Update or insert the category in the categories collection
#             result = categories_collection.update_one(
#                 {"sortGroup": sort_group},  # Search for existing category by SortGroup
#                 {
#                     "$set": {
#                         "sortGroup": sort_group,
#                         "name": category_name,
#                         "globalCategory": global_category_name,  # Set the global category
#                         "type": category_type  # Set the Type field
#                     }
#                 },
#                 upsert=True  # Insert if the category doesn't exist
#             )

#     #         if result.matched_count > 0:
#     #             logger.info(f"Updated category with SortGroup: {sort_group}, GlobalCategory: {global_category_name}, Type: {category_type}")
#     #         else:
#     #             logger.info(f"Inserted new category with SortGroup: {sort_group}, GlobalCategory: {global_category_name}, Type: {category_type}")
#     #     else:
#     #         logger.warning(f"SortGroup {sort_group} not found in the mapping")

#     # logger.info("Categories processed successfully!")