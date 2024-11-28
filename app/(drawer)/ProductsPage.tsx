import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Text, Dimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import axiosInstance from '../../services/axiosInstance';
import CategoryList from '../../components/CategoryList';
import ProductList from '../../components/ProductList';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Product, Category } from '../../components/types';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { Button } from "react-native-paper";

type ProductsPageRouteParams = {
  ProductsPage: { selectedType: string | null; items?: Product[] };
};

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const { addToCart } = useCart();

  const route = useRoute<RouteProp<ProductsPageRouteParams, 'ProductsPage'>>();
  const selectedType = route.params?.selectedType || null;

  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState(false); // New state for search mode
  const flatListRef = useRef<FlatList>(null);

  // Add state to handle dynamic numColumns
  const [numColumns, setNumColumns] = useState(2);
  const [flatListKey, setFlatListKey] = useState('default'); // Used to force re-render of FlatList

  useEffect(() => {
    const calculateColumns = () => {
      const screenWidth = Dimensions.get('window').width;
      const itemWidth = 160; // Approximate width for each item
      const calculatedColumns = Math.max(1, Math.floor(screenWidth / itemWidth));
      setNumColumns(calculatedColumns); // Update numColumns dynamically
      setFlatListKey(`columns-${calculatedColumns}`); // Update key to re-render FlatList
    };

    calculateColumns();
    const subscription = Dimensions.addEventListener('change', calculateColumns);

    return () => subscription?.remove(); // Clean up listener
  }, []);

  // Fetch categories when the component mounts or the type changes
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

        const grouped: { [key: string]: Category[] } = {};
        fetchedCategories.forEach((category: Category) => {
          const globalCategory = category.globalCategory || "Other";
          if (!grouped[globalCategory]) {
            grouped[globalCategory] = [];
          }
          grouped[globalCategory].push(category);
        });

        setGroupedCategories(grouped);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedType]);

  // Fetch items based on the selected category
  useEffect(() => {
    if (!isSearchActive && selectedCategory !== null) {
      const fetchItems = async () => {
        try {
          setLoading(true);
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
  }, [selectedCategory, user.prices_tag, isSearchActive]);

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) {
        console.warn('Search query is empty');
        handleClearSearch(); // Clear search when the query is empty
        return;
      }
  
      
      setLoading(true);
      setIsSearchActive(true); // Enable search mode
      const response = await axiosInstance.get(`/items/search`, {
        params: { query: searchQuery.trim() },
      });
  
      const fetchedItems = response.data.items;
      console.log("Search Results:", fetchedItems);
      setItems(fetchedItems); // Update state with search results
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: Product, quantity: number) => {
    addToCart({ ...item, quantityInCart: quantity, image: item.image || '../../assets/images/icon.png' });
  };

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  const handleClearSearch = () => {
    setIsSearchActive(false); // Disable search mode
    setSearchQuery(''); // Clear the search query
    setSelectedCategory(null); // Reset selected category
  };
  
  if (loading) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {isSearchActive ? (
        // Show search results only
        <ProductList
          key={flatListKey}
          products={items}
          onAddToCart={handleAddToCart}
          isMobile={false}
          flatListRef={flatListRef}
          onScrollToTop={handleScrollToTop}
          numColumns={numColumns} // Pass dynamic numColumns
        />
      ) : selectedType && !selectedCategory ? (
        // Show categories if not in search mode
        <FlatList
          ref={flatListRef}
          data={Object.keys(groupedCategories)}
          renderItem={({ item }) => {
            const globalCategory = item;
            const filteredCategories = groupedCategories[globalCategory].filter(
              (category: Category) => category.type === selectedType
            );
            return filteredCategories.length > 0 ? (
              <CategoryList
                categories={filteredCategories}
                onSelectCategory={setSelectedCategory}
                isMobile={true}
                globalCategory={globalCategory}
              />
            ) : null;
          }}
          keyExtractor={(item) => item}
        />
      ) : selectedCategory ? (
        <>
          {/* <Button mode="outlined" onPress={() => setSelectedCategory(null)} style={{ margin: 10 }}>
            Back to Categories
          </Button> */}
          <ProductList
            key={flatListKey}
            products={items}
            onAddToCart={handleAddToCart}
            isMobile={false}
            flatListRef={flatListRef}
            onScrollToTop={handleScrollToTop}
            numColumns={numColumns} // Pass dynamic numColumns
          />
        </>
      ) : null}

      {/* Scroll-to-Top Button */}
      {items.length > 5 && (
        <Button
          mode="contained"
          onPress={handleScrollToTop}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            borderRadius: 50,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          Scroll to Top
        </Button>
      )}
    </View>
  );
};

export default ProductsPage;
