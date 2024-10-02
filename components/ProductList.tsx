// ProductList.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import { GlobalStyles } from '../constants/GlobalStyles';
import ProductItem from './ProductItem';  // Reusable ProductItem component
import { Product } from './types';  // Import shared Product type

interface Props {
  products: Product[];  // Use the shared Product type here
  onAddToCart: (item: Product, quantity: number) => void;
  isMobile: boolean;
}

const ProductList: React.FC<Props> = ({ products, onAddToCart, isMobile }) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductItem item={item} onAddToCart={onAddToCart} />}
      numColumns={isMobile ? 1 : 2}
      columnWrapperStyle={isMobile ? undefined : GlobalStyles.columnWrapper}
      keyExtractor={item => item.id}
    />
  );
};

export default ProductList;
