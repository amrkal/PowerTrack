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
  const [showPrice, setShowPrice] = useState(false); // State to toggle price visibility

  const fetchPrice = async () => {
    console.log("Fetching price for item:", item.item_name, "with pricesTag:", pricesTag);
    if (showPrice) {
      setShowPrice(false); // Hide the price if it's already shown
      return;
    }

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
      setShowPrice(true); // Show the price after fetching
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
        <View style={styles.priceContainer}>
          <TouchableOpacity onPress={fetchPrice} style={styles.priceDot}>
          {loadingPrice ? (
            <ActivityIndicator animating={true} size="small" color="#fff" />
          ) : (
            <View style={{ width: 10, height: 10 }} /> 
          )}
          </TouchableOpacity>
        </View>

      <Image
        source={item.image ? { uri: item.image } : require('../assets/images/icon.png')}
        style={GlobalStyles.image}
      />
      <View style={GlobalStyles.infoContainer}>
        <Text style={GlobalStyles.name}>{item.item_name}</Text>
        <View style={styles.priceContainer}>
        </View>
        <Text style={GlobalStyles.description}>{item.description || 'No description available.'}</Text>
        {showPrice && price && (
          <Text style={styles.priceDisplay}>₪ {price}</Text> // Price displayed below description
        )}
        <View style={GlobalStyles.quantityContainer}>
        <Button
          mode="outlined"
          onPress={decreaseQuantity}
          compact
          style={GlobalStyles.quantityButton}
        >
          -
        </Button>
          <TextInput
            style={GlobalStyles.quantityInput}
            keyboardType="numeric"
            value={quantityInCart}
            onChangeText={(text) => /^\d*$/.test(text) && setQuantityInCart(text)}
            onBlur={() => quantityInCart.trim() === '' && setQuantityInCart('1')}
          />
        <Button
          mode="outlined"
          onPress={increaseQuantity}
          compact
          style={GlobalStyles.quantityButton}
        >
          +
        </Button>
        </View>
        <Button mode="outlined" onPress={handleAddToCart} style={GlobalStyles.addToCartButton}>
          הוספה לסל
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    position: 'relative', // Allows positioning of the dot
    alignSelf: 'flex-end', // Aligns the container to the right
    marginRight: 10, // Adds spacing from the right edge
  },
  priceDot: {
    width: 30, // Dot size
    height: 30,
    borderRadius: 15, // Makes it a circle
    backgroundColor: '#ffa11d', // Orange color
    justifyContent: 'center', // Centers the content
    alignItems: 'center', // Centers the content
    elevation: 5, // Adds a shadow for better visibility
    marginTop:5,
  },
  priceText: {
    fontSize: 10, // Smaller font size to fit inside the dot
    fontWeight: 'bold',
    color: '#fff', // White text for better contrast
  },
  priceDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default ProductItem;
