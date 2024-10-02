// ProductItem.tsx
import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { GlobalStyles } from '../constants/GlobalStyles';
import { Product } from './types';  // Import shared Product type

interface Props {
  item: Product;  // Use the shared Product type here
  onAddToCart: (item: Product, quantity: number) => void;
}

const ProductItem: React.FC<Props> = ({ item, onAddToCart }) => {
  const [quantityInCart, setQuantityInCart] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const increaseQuantity = () => setQuantityInCart(prev => prev + 1);
  const decreaseQuantity = () => setQuantityInCart(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    onAddToCart(item, quantityInCart);
    setFeedbackMessage('Item added to cart!');
    setTimeout(() => setFeedbackMessage(''), 2000); // Clear feedback message after 2 seconds
  };

  return (
    <View style={GlobalStyles.productContainer}>
      <Text style={GlobalStyles.productName}>{item.item_name}</Text>
      <Text style={GlobalStyles.productPrice}>{`₪ ${item.price}`}</Text>
      <Image
        source={item.image ? { uri: item.image } : require('../assets/images/icon.png')}
        style={GlobalStyles.productImage}
      />
      <Text>{item.description}</Text>
      <View style={GlobalStyles.quantityContainer}>
        <Button mode="contained" onPress={decreaseQuantity} compact>
          -
        </Button>
        <Text>{quantityInCart}</Text>
        <Button mode="contained" onPress={increaseQuantity} compact>
          +
        </Button>
      </View>
      <Button mode="contained" onPress={handleAddToCart} style={GlobalStyles.addToCartButton}>
        Add to Cart
      </Button>
      {feedbackMessage ? <Text style={{ color: 'green' }}>{feedbackMessage}</Text> : null}
    </View>
  );
};


export default ProductItem;
