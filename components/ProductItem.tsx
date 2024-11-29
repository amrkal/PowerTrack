import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Product } from './types';
import { GlobalStyles } from '../constants/GlobalStyles';
import axiosInstance from '@/services/axiosInstance';

interface Props {
  item: Product;
  onAddToCart: (item: Product, quantity: number) => void;
  pricesTag?: string;
  onScrollToTop: () => void; // Include this in Props
}

const ProductItem: React.FC<Props> = ({ item, onAddToCart, pricesTag, onScrollToTop }) => {
  const [quantityInCart, setQuantityInCart] = useState<string>('1');
  const [price, setPrice] = useState<string | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const fetchPrice = async () => {
    console.log("Fetching price for item:", item.item_name, "with pricesTag:", pricesTag);

    if (!pricesTag) {
      console.error("Price tag is missing in fetchPrice.");
      alert('Price tag is missing. Unable to fetch price.');
      return;
    }

    setLoadingPrice(true);
    try {
      const response = await axiosInstance.get(`/items/items/priceof/${item.item_key}`, {
        params: { prices_tag: pricesTag }, // Match the query parameter name from Flask
      });

      if (response.data?.price) {
        console.log("Price fetched successfully:", response.data.price);
        setPrice(parseFloat(response.data.price).toFixed(2));
      } else {
        console.warn("Price not found for this item.");
        alert('Price not found for this item.');
        setPrice(null); // Handle case where price is not returned
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      alert('Failed to fetch price. Please try again later.');
    } finally {
      setLoadingPrice(false);
    }
  };

  const increaseQuantity = () => {
    const currentQuantity = parseInt(quantityInCart, 10) || 1;
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

  return (
    <View style={GlobalStyles.card}>
      <Image
        source={item.image ? { uri: item.image } : require('../assets/images/icon.png')}
        style={GlobalStyles.image}
      />
      <View style={GlobalStyles.infoContainer}>
        <Text style={GlobalStyles.name}>{item.item_name}</Text>
        <View style={styles.priceContainer}>
          <TouchableOpacity onPress={fetchPrice} style={styles.priceButton}>
            {loadingPrice ? (
              <ActivityIndicator animating={true} size="small" />
            ) : (
              <Text style={styles.priceText}>{price ? `₪ ${price}` : '?'}</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={GlobalStyles.description}>{item.description || 'No description available.'}</Text>
        <View style={GlobalStyles.quantityContainer}>
          <Button mode="contained" onPress={decreaseQuantity} compact style={GlobalStyles.quantityButton}>
            -
          </Button>
          <TextInput
            style={GlobalStyles.quantityInput}
            keyboardType="numeric"
            value={quantityInCart}
            onChangeText={(text) => /^\d*$/.test(text) && setQuantityInCart(text)}
            onBlur={() => quantityInCart.trim() === '' && setQuantityInCart('1')}
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

const styles = StyleSheet.create({
  priceContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  priceButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ProductItem;
