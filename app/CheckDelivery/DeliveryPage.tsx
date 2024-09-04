import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const DeliveryPage: React.FC = () => {
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  const handleConfirm = () => {
    // Pass the address to the next step or save it in the state/store
    router.push('/CheckDelivery/CheckOutPage');
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Delivery Details</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Enter your delivery address"
        value={address}
        onChangeText={setAddress}
      />

      <Button
        style={[GlobalStyles.button, { marginTop: 20 }]}
        onPress={handleConfirm}
        disabled={!address}
      >
        <Text style={GlobalStyles.buttonText}>Confirm Address</Text>
      </Button>
    </View>
  );
};

export default DeliveryPage;
