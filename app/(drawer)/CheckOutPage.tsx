import React, { useState } from 'react';
import { View, Alert, StyleSheet, Dimensions } from 'react-native';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useRouter } from 'expo-router';
import { Button, TextInput, Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window'); // For responsive layout

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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Checkout Options</Title>
          <Paragraph style={styles.paragraph}>
            Choose how you'd like to receive your order.
          </Paragraph>
          
          {/* Self Collection */}
          <Button
            style={[styles.optionButton, selectedOption === 'Take Away' ? styles.selectedButton : styles.defaultButton]}
            mode="contained"
            onPress={() => setSelectedOption('Take Away')}
          >
            Self Collection
          </Button>

          {/* Delivery */}
          <Button
            style={[styles.optionButton, selectedOption === 'Delivery' ? styles.selectedButton : styles.defaultButton]}
            mode="contained"
            onPress={() => setSelectedOption('Delivery')}
          >
            Delivery
          </Button>

          {/* Delivery Fields */}
          {selectedOption === 'Delivery' && (
            <View style={styles.inputContainer}>
              <TextInput
                label="City"
                mode="outlined"
                value={city}
                onChangeText={setCity}
                style={styles.input}
              />
              <TextInput
                label="Address"
                mode="outlined"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
              />
            </View>
          )}

          {/* Next Button */}
          <Button
            style={styles.nextButton}
            disabled={!selectedOption}
            mode='contained'
            onPress={handleNextPress}
          >
            Next
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f4f7',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  optionButton: {
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 10,
  },
  selectedButton: {
    backgroundColor: '#1E90FF',
  },
  defaultButton: {
    backgroundColor: 'lightblue',
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 16,
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1E90FF',
  },
});

export default CheckOutPage;