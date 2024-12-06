import React, { useState } from 'react';
import { View, Alert, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, TextInput, Card, Title, Paragraph } from 'react-native-paper';
import axiosInstance from '../../services/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window'); // For responsive layout

const CheckOutPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'Collection' | 'Delivery' | null>(null);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const { cart } = useCart(); // Access cart from the context
  const router = useRouter();

  const handleOrderCompletion = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('לא נמצא טוקן גישה');
        return;
      }

      const orderDetails = {
        items: cart.map(item => ({
          id: item.id,
          item_key: item.item_key,
          name: item.name,
          quantity: item.quantityInCart,
          price_per_unit: item.price,
        })),
        total_amount: cart.reduce((total, item) => total + item.price * item.quantityInCart, 0),
      };

      const response = await axiosInstance.post('/orders/orders', orderDetails, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        Alert.alert('הצלחה', 'ההזמנה הושלמה בהצלחה!');
        router.push('/ProductsPage');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'משהו השתבש בהשלמת ההזמנה.');
    }
  };

  const handleNextPress = () => {
    if (selectedOption === 'Collection') {
      handleOrderCompletion();
    } else if (selectedOption === 'Delivery') {
      if (city && address) {
        handleOrderCompletion();
      } else {
        Alert.alert('שגיאה', 'יש למלא עיר וכתובת.');
      }
    }
  };

  return (
    <View style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>בחרו כיצד תרצו לקבל את ההזמנה שלכם.
        </Title>

        <Button
          style={[
            styles.optionButton,
            selectedOption === 'Collection' && styles.selectedButton,
          ]}
          mode="outlined"
          onPress={() => setSelectedOption('Collection')}
        >
          איסוף עצמי
        </Button>

        <Button
          style={[
            styles.optionButton,
            selectedOption === 'Delivery' && styles.selectedButton,
          ]}
          mode="outlined"
          onPress={() => setSelectedOption('Delivery')}
        >
          משלוח
        </Button>

        {selectedOption === 'Delivery' && (
          <View style={styles.inputContainer}>
            <TextInput
              label="עיר"
              mode="outlined"
              value={city}
              onChangeText={setCity}
              style={styles.input}
            />
            <TextInput
              label="כתובת"
              mode="outlined"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
          </View>
        )}

        <Button
          style={styles.nextButton}
          disabled={!selectedOption}
          mode="contained"
          onPress={handleNextPress}
        >
          הבא
        </Button>
      </Card.Content>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 10,
  },
  selectedButton: {
    backgroundColor: '#ff7600', // Highlighted orange color
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
});

export default CheckOutPage;
