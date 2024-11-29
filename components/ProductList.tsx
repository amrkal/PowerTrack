import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { GlobalStyles } from '../constants/GlobalStyles';
import ProductItem from './ProductItem'; // Reusable ProductItem component
import { Product } from './types'; // Shared Product type
import { Button } from 'react-native-paper'; // For Scroll-to-Top Button
interface Props {
  products: Product[];
  onAddToCart: (item: Product, quantity: number) => void;
  isMobile: boolean;
  flatListRef?: React.RefObject<FlatList<Product>>;
  onScrollToTop?: () => void;
  numColumns: number;
  pricesTag: string; // Make pricesTag optional
}

const ProductList: React.FC<Props> = ({
  products,
  onAddToCart,
  isMobile,
  flatListRef,
  onScrollToTop = () => {},
  numColumns,
  pricesTag,
}) => {
  console.log("Received pricesTag in ProductList:", pricesTag);
  // Scroll-to-Top Handler
  const handleScrollToTop = () => {
    if (flatListRef?.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    } else {
      onScrollToTop();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Feedback for Search Results */}
      <Text style={{ margin: 10, fontSize: 16, fontWeight: "bold" }}>
        {products.length > 0
          ? `Found ${products.length} product${products.length > 1 ? "s" : ""}`
          : "No products available"}
      </Text>

      {/* FlatList for Displaying Products */}
      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            onAddToCart={onAddToCart}
            onScrollToTop={onScrollToTop}
            pricesTag={pricesTag} // Pass pricesTag to ProductItem
          />
        )}
        numColumns={numColumns}
        columnWrapperStyle={
          !isMobile && numColumns > 1 ? GlobalStyles.columnWrapper : undefined
        }
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }} // Space for Scroll-to-Top button
      />

      {/* Scroll-to-Top Button */}
      {products.length > 5 && (
        <Button
          mode="contained"
          onPress={handleScrollToTop}
          style={{
            position: "absolute",
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
