import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useRouter } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';

const CheckOutPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'Take Away' | 'Delivery' | null>(null);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleOrderCompletion = async () => {
    try {
      let orderDetails = {
        option: selectedOption,
        city: city || 'N/A',
        address: address || 'N/A',
      };

      // Make an API request to add the order to the database
      const response = await axios.post('https://your-api-endpoint/orders', orderDetails);

      if (response.status === 200) {
        Alert.alert('Success', 'Your order has been completed!');
        // Optionally, navigate to another page or reset the form
        router.push('/ProductsPage'); // Assuming you have an OrderCompleted page
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
