import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const DeliveryPage: React.FC = () => {
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  const handleConfirm = () => {
    // Pass the address to the next step or save it in the state/store
    router.push('/(drawer)/CheckOutPage');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Delivery Details</Text>
          
          {/* Delivery Address Input */}
          <TextInput
            label="Delivery Address"
            mode="outlined"
            placeholder="Enter your delivery address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
          
          {/* Confirm Button */}
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.confirmButton}
            disabled={!address}
          >
            Confirm Address
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7', 
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff', 
    elevation: 5, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E90FF', 
    marginBottom: 20,
  },
  input: {
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1E90FF', 
  },
});

export default DeliveryPage;
