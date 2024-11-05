import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import axiosInstance from '../../services/axiosInstance';
import CategoryList from '../../components/CategoryList';
import ProductList from '../../components/ProductList';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Product, Category } from '../../components/types';  // Import shared types
import { GlobalStyles } from '../../constants/GlobalStyles'; // Import GlobalStyles for rectangle styling
import { Button } from "react-native-paper";

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const { addToCart } = useCart();
  
  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({});
  const [types, setTypes] = useState<string[]>([]);  // Unique types
  const [selectedType, setSelectedType] = useState<string | null>(null);  // Selected type
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);  // Selected category (sortGroup)
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories/categories');
        let data = response.data;

        if (typeof data === 'string') {
          data = data.replace(/NaN/g, '"Unknown"');
          data = JSON.parse(data);
        }

        const fetchedCategories: Category[] = data.categories || [];

        if (!fetchedCategories.length) {
          console.warn("No categories found in the response");
          return;
        }

        // Extract unique types from the fetched categories
        const uniqueTypes = Array.from(new Set(fetchedCategories.map((category: Category) => category.type)));
        setTypes(uniqueTypes);

        // Group categories by global category ensuring unique global category names
        const grouped: { [key: string]: Category[] } = {};
        fetchedCategories.forEach((category: Category) => {
          const globalCategory = category.globalCategory || "Other"; // Fallback if no global category
          if (!grouped[globalCategory]) {
            grouped[globalCategory] = []; // Initialize if it doesn't exist
          }
          grouped[globalCategory].push(category); // Push the category to the respective global category
        });

        setGroupedCategories(grouped);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      const fetchItems = async () => {
        try {
          const response = await axiosInstance.get(`/items/items/price/${selectedCategory}?priceListNumber=${user.prices_tag}`);
          setItems(response.data.items);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchItems();
    }
  }, [selectedCategory, user.prices_tag]);

  const handleAddToCart = (item: Product, quantity: number) => {
    addToCart({ ...item, quantityInCart: quantity, image: item.image || '../../assets/images/icon.png' });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1 }}>
      {!selectedType ? (
        <FlatList
          data={types}  // List of unique types
          renderItem={({ item: type }) => (
            <TouchableOpacity 
              onPress={() => setSelectedType(type)} 
              style={GlobalStyles.rectangle} // Apply rectangle style
            >
              <Text style={GlobalStyles.rectangleText}>{type}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      ) : null}

      {selectedType && !selectedCategory ? (
              <>
                <Button 
                  mode="outlined" 
                  onPress={() => setSelectedType(null)}  // Reset selectedType to go back to type selection
                  style={{ margin: 10 }}
                >
                  Back to Types
                </Button>
                <FlatList
                  data={Object.keys(groupedCategories)} // Use the keys of the grouped object for global categories
                  renderItem={({ item: globalCategory }) => {
                    const filteredCategories = groupedCategories[globalCategory].filter(category => category.type === selectedType);

                    return filteredCategories.length > 0 ? (
                      <CategoryList
                        categories={filteredCategories} // Pass the array of filtered categories for the selected type
                        onSelectCategory={setSelectedCategory}
                        isMobile={true}
                        globalCategory={globalCategory} // Pass global category name for display
                      />
                    ) : null;
                  }}
                  keyExtractor={(item) => item} // Use the global category name as the key
                />
              </>
            ) : null}

      {selectedCategory ? (
        <>
          <Button mode="outlined" onPress={() => setSelectedCategory(null)} style={{ margin: 10 }}>
            Back to Categories
          </Button>
          <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
          <ProductList
            products={items.filter(item => item.item_name.toLowerCase().includes(searchQuery.toLowerCase()))}
            onAddToCart={handleAddToCart} isMobile={false}          />
        </>
      ) : null}
    </View>
  );
};

export default ProductsPage;
