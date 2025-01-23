import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Card, Title } from 'react-native-paper';
import axiosInstance from '../../services/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

const CheckOutPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'Collection' | 'Delivery' | null>(null);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const navigation = useNavigation<any>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign
          name="bars"
          size={30}
          color="#1E3A8A"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      ),
      headerLeft: () => null, // Hide the default header
    });
  }, [navigation]);

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
          item_name: item.item_name,
          quantity: item.quantityInCart,
          price_per_unit: item.price,
        })),
        total_amount: cart.reduce(
          (total, item) => total + item.price * item.quantityInCart,
          0
        ),
        delivery_method: selectedOption,
        ...(selectedOption === 'Delivery' && { city, address }),
      };

      const response = await axiosInstance.post('/orders/orders', orderDetails, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        clearCart();
        Alert.alert('הצלחה', 'ההזמנה הושלמה בהצלחה!');
        router.push('/HomePage');
      }
    } catch (error) {
      Alert.alert('שגיאה', 'משהו השתבש בהשלמת ההזמנה.');
    }
  };

  const isNextButtonEnabled = () => {
    if (selectedOption === 'Collection') return true;
    if (selectedOption === 'Delivery') return city.trim() !== '' && address.trim() !== '';
    return false;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={GlobalStyles.checkoutCard}>
      <Card.Content>
        <Title style={GlobalStyles.checkoutTitle}>בחרו כיצד תרצו לקבל את ההזמנה שלכם.</Title>

        {/* Collection Button */}
        <View style={GlobalStyles.profileButton}>
          <Button
            mode="contained"
            onPress={() => setSelectedOption(selectedOption === 'Collection' ? null : 'Collection')}
            contentStyle={[
              GlobalStyles.checkoutOptionButton,
              selectedOption === 'Collection' && GlobalStyles.filledButton, // Highlight when selected
            ]}
          >
            איסוף עצמי
          </Button>
        </View>

        {/* Delivery Button */}
        <View style={GlobalStyles.profileButton}>
          <Button
            mode="contained"
            onPress={() => setSelectedOption(selectedOption === 'Delivery' ? null : 'Delivery')}
            contentStyle={[
              GlobalStyles.checkoutOptionButton,
              selectedOption === 'Delivery' && GlobalStyles.filledButton, // Highlight when selected
            ]}
          >
            משלוח
          </Button>
        </View>

        {/* Address Inputs for Delivery */}
        {selectedOption === 'Delivery' && (
          <View>
            <TextInput
              label="עיר"
              mode="outlined"
              value={city}
              onChangeText={setCity}
              style={GlobalStyles.authInput}
            />
            <TextInput
              label="כתובת"
              mode="outlined"
              value={address}
              onChangeText={setAddress}
              style={GlobalStyles.authInput}
            />
          </View>
        )}

        {/* Next Button */}
        <Button
          mode="contained"
          onPress={handleOrderCompletion}
          disabled={!isNextButtonEnabled()}
          contentStyle={{ height: 50 }}
        >
          הבא
        </Button>
      </Card.Content>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CheckOutPage;
