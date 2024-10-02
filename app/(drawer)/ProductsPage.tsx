import React, { useState, useEffect } from "react";
import { View, useWindowDimensions, FlatList } from 'react-native';
import { Button } from 'react-native-paper'; 
import axios from 'axios';
import CategoryList from '../../components/CategoryList';
import ProductList from '../../components/ProductList';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Product, Category } from '../../components/types';  // Import shared types

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const { addToCart } = useCart();
  const { width } = useWindowDimensions();
  
  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);  
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isMobile = width < 768;

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories/categories');
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
          const response = await axios.get(`/items/items/price/${selectedCategory}?priceListNumber=${user.prices_tag}`);
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
      {!selectedCategory ? (
        <FlatList
          data={Object.keys(groupedCategories)} // Use the keys of the grouped object for global categories
          renderItem={({ item: globalCategory }) => (
            <CategoryList
              categories={groupedCategories[globalCategory]} // Pass the array of categories for the global category
              onSelectCategory={setSelectedCategory}
              isMobile={isMobile}
              globalCategory={globalCategory} // Pass global category name for display
            />
          )}
          keyExtractor={(item) => item} // Use the global category name as the key
        />
      ) : (
        <>
          <Button mode="outlined" onPress={() => setSelectedCategory(null)} style={{ margin: 10 }}>
            Back to Categories
          </Button>
          <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
          <ProductList
            products={items.filter(item => item.item_name.toLowerCase().includes(searchQuery.toLowerCase()))}
            onAddToCart={handleAddToCart}
            isMobile={isMobile}
          />
        </>
      )}
    </View>
);
};

export default ProductsPage;
