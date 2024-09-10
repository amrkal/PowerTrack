import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useRouter } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';

const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;

const CheckOutPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'Take Away' | 'Delivery' | null>(null);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const { cart } = useCart();  // Access cart from the context
  const router = useRouter();

  
  const handleOrderCompletion = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
      
      const orderDetails = {
        items: cart.map(item => ({
          id: item.id,
          item_key: item.item_key,  // Ensure item_key is sent along with other details
          name: item.name,
          quantity: item.quantityInCart,
          price_per_unit: item.price,
        })), // Map items from the cart
        total_amount: cart.reduce((total, item) => total + item.price * item.quantityInCart, 0),
      };
      console.log('Cart items:', cart);
      const response = await axios.post('/orders/orders', orderDetails, {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Use the stored token
        },
      });
  
      if (response.status === 201) {
        Alert.alert('Success', 'Your order has been completed!');
        router.push('/ProductsPage');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while completing your order.');
    }
  };

  const handleNextPress = () => {
    if (selectedOption === 'Take Away') {
      handleOrderCompletion();
    } else if (selectedOption === 'Delivery') {
      if (city && address) {
        handleOrderCompletion();
      } else {
        Alert.alert('Error', 'Please fill in both city and address.');
      }
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Button
        style={{ margin: 15 }}
        mode='contained'
        onPress={() => setSelectedOption('Take Away')}
      >
        Self Collection
      </Button>


      <Button
        style={{ margin: 15 }}
        mode='contained'
        onPress={() => setSelectedOption('Delivery')}
      >
        Delivery
      </Button>

      {selectedOption === 'Delivery' && (
        <View>
          <TextInput
            label="City"
            mode="outlined"
            value={city}
            onChangeText={setCity}
            style={{ marginVertical: 10 }}
          />
          <TextInput
            label="Address"
            mode="outlined"
            value={address}
            onChangeText={setAddress}
            style={{ marginVertical: 10 }}
          />
        </View>
      )}

      <Button
        style={{ margin: 15 }}
        disabled={!selectedOption}
        mode='contained'
        onPress={handleNextPress}
      >
        Next
      </Button>
    </View>
  );
};

export default CheckOutPage;
