import React, { useState, useMemo } from "react";
import {  FlatList, View,  } from "react-native";
import{Button,Text, TextInput,} from 'react-native-paper';
import { useItems } from '../context/ItemsContext'; // Import the context
import { GlobalStyles } from "../../constants/GlobalStyles";
import { useCart } from '../context/CartContext';

const ProductsPage: React.FC = () => {
  const { items, loading } = useItems(); // Get items from context
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => items.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    return matchesCategory && product.item_name.toLowerCase().includes(searchQuery.toLowerCase());
  }), [items, selectedCategory, searchQuery]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Search Products"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <View style={GlobalStyles.productContainer}>
            <Text>{item.item_name}</Text>
            <Text>{item.price}</Text>
            <Button onPress={() => addToCart(item, 1)}>Add to Cart</Button>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ProductsPage;
