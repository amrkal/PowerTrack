import React, { useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { GlobalStyles } from '../constants/GlobalStyles';
import ProductItem from './ProductItem'; // Reusable ProductItem component
import { Product } from './types'; // Import shared Product type
import { Button } from 'react-native-paper'; // For Scroll to Top Button

interface Props {
  products: Product[]; // Use the shared Product type here
  onAddToCart: (item: Product, quantity: number) => void;
  isMobile: boolean;
  flatListRef?: React.RefObject<FlatList<Product>>;
  onScrollToTop?: () => void; // Optional now
  numColumns: number; // Add this line to include numColumns in Props
}


const ProductList: React.FC<Props> = ({ products, onAddToCart, isMobile, flatListRef, onScrollToTop = () => {},numColumns,}) => {

  const handleScrollToTop = () => {
    if (flatListRef?.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    } else if (onScrollToTop) {
      onScrollToTop();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Feedback Message for Search Results
      <Text style={{ margin: 10, fontSize: 16, fontWeight: 'bold' }}>
        {products.length > 0
          ? `Found ${products.length} product${products.length > 1 ? 's' : ''}`
          : 'No products available'}
      </Text> */}

      {/* FlatList for Product Items */}
      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={({ item }) => <ProductItem item={item} onAddToCart={onAddToCart} onScrollToTop={onScrollToTop} />}
        numColumns={numColumns}
        columnWrapperStyle={!isMobile && numColumns > 1 ? GlobalStyles.columnWrapper : undefined}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }} // Space for Scroll-to-Top button
      />

      {/* Scroll-to-Top Button */}
      {products.length > 5 && (
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

export default ProductList;
