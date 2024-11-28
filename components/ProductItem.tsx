import React, { useState } from 'react';
import { View, Image,StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Product } from './types';
import { GlobalStyles } from '../constants/GlobalStyles';


interface Props {
  item: Product;
  onAddToCart: (item: Product, quantity: number) => void;
  onScrollToTop: () => void; // New prop
}

const ProductItem: React.FC<Props> = ({ item, onAddToCart , onScrollToTop}) => {
  const [quantityInCart, setQuantityInCart] = useState<string>('1'); // Allow string for the input

  const increaseQuantity = () => {
    const currentQuantity = parseInt(quantityInCart, 10) || 1; // Default to 1 if empty
    setQuantityInCart((currentQuantity + 1).toString());
  };

  const decreaseQuantity = () => {
    const currentQuantity = parseInt(quantityInCart, 10) || 1;
    if (currentQuantity > 1) {
      setQuantityInCart((currentQuantity - 1).toString());
    }
  };

  const handleAddToCart = () => {
    const quantity = parseInt(quantityInCart, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    onAddToCart(item, quantity);
  };

  const handleQuantityChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setQuantityInCart(text); // Allow numeric input or empty string
    }
  };

  const handleQuantityBlur = () => {
    // Reset to 1 if the input is empty
    if (quantityInCart.trim() === '') {
      setQuantityInCart('1');
    }
  };

  return (
    <View style={GlobalStyles.card}>
      <Image
        source={item.image ? { uri: item.image } : require('../assets/images/icon.png')}
        style={GlobalStyles.image}
      />
      <View style={GlobalStyles.infoContainer}>
        <Text style={GlobalStyles.name}>{item.item_name}</Text>
        <Text style={GlobalStyles.price}>{`₪ ${item.price.toFixed(2)}`}</Text>
        <Text style={GlobalStyles.description}>{item.description || 'No description available.'}</Text>

        <View style={GlobalStyles.quantityContainer}>
          <Button mode="contained" onPress={decreaseQuantity} compact style={GlobalStyles.quantityButton}>
            -
          </Button>
          <TextInput
            style={GlobalStyles.quantityInput}
            keyboardType="numeric"
            value={quantityInCart}
            onChangeText={handleQuantityChange}
            onBlur={handleQuantityBlur} // Reset on blur if empty
          />
          <Button mode="contained" onPress={increaseQuantity} compact style={GlobalStyles.quantityButton}>
            +
          </Button>
        </View>

        <Button mode="contained" onPress={handleAddToCart} style={GlobalStyles.addToCartButton}>
          Add to Cart
        </Button>
      </View>
    </View>
  );
};

export default ProductItem;
