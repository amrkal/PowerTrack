import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
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

// Define the route parameters type
type ProductsPageRouteParams = {
  ProductsPage: { selectedType: string | null };
};

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const { addToCart } = useCart();
  
  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute<RouteProp<ProductsPageRouteParams, 'ProductsPage'>>();
  const selectedType = route.params?.selectedType || null;
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  console.log("Received Params in ProductsPage:", route.params);

  // Reset selectedCategory whenever selectedType changes
  useEffect(() => {
    setSelectedCategory(null);
  }, [selectedType]);

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
      {selectedType && !selectedCategory ? (
        <>
          <FlatList
            data={Object.keys(groupedCategories)}
            renderItem={({ item: globalCategory }) => {
              const filteredCategories = groupedCategories[globalCategory].filter(category => category.type === selectedType);
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
            onAddToCart={handleAddToCart} isMobile={false} />
        </>
      ) : null}
    </View>
  );
};

export default ProductsPage;
