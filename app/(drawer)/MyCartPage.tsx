import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router'; // Import useRouter
import { useCart } from '../context/CartContext'; // Import CartContext
import { GlobalStyles } from '@/constants/GlobalStyles';

const MyCartPage: React.FC = () => {
  const router = useRouter();
  const { cart, updateCartItem, removeFromCart } = useCart();

  const handleDelete = (id: string) => {
    removeFromCart(id); // Remove item from cart using CartContext
  };

  const handleQuantityChange = (id: string, quantity: string) => {
    // Allow the user to clear the input
    if (quantity === '') {
      updateCartItem(id, 0); // Temporarily set to 0 if the field is cleared
      return;
    }

    const numericQuantity = parseInt(quantity, 10);
    if (!isNaN(numericQuantity) && numericQuantity >= 0) {
      updateCartItem(id, numericQuantity); // Update the quantity in the cart
    }
  };

  const handleIncreaseQuantity = (id: string) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      updateCartItem(id, item.quantityInCart + 1); // Increase quantity in the cart
    }
  };

  const handleDecreaseQuantity = (id: string) => {
    const item = cart.find(item => item.id === id);
    if (item && item.quantityInCart > 1) {
      updateCartItem(id, item.quantityInCart - 1); // Decrease quantity but not below 1
    }
  };


  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);

  function setQuantityInCart(text: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View>
            <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyles.cartItem}>
            <Button
              mode="contained"
              icon="trash-can" // Use the trash icon here
              buttonColor="red"
              contentStyle={{ justifyContent: 'center', alignItems: 'center' }}
              style={GlobalStyles.deleteButton}
              compact
              onPress={() => handleDelete(item.id)} children={undefined}/>
            <Image
              source={item.image ? { uri: item.image } : require('../../assets/images/icon.png')}
              style={GlobalStyles.cartItemImage}
            />
            <View style={GlobalStyles.cartItemDetails}>
              <Text style={GlobalStyles.cartItemName}>{item.item_name}</Text>
              <Text style={GlobalStyles.cartItemPrice}>₪{item.price.toFixed(2)}</Text>

              <View style={GlobalStyles.quantityContainer}>
                <Button
                  mode="outlined"
                  onPress={() => handleDecreaseQuantity(item.id)}
                  style={GlobalStyles.quantityButton}
                >
                  -
                </Button>
                <TextInput
                  style={GlobalStyles.quantityInput}
                  keyboardType="numeric"
                  value={item.quantityInCart > 0 ? item.quantityInCart.toString() : ''}
                  onChangeText={(text) => handleQuantityChange(item.id, text)}
                  onBlur={() => {
                    if (item.quantityInCart === 0) {
                      updateCartItem(item.id, 1); // Reset to 1 if left empty
                    }
                  }}
                />
                <Button
                  mode="outlined"
                  onPress={() => handleIncreaseQuantity(item.id)}
                  style={GlobalStyles.quantityButton}
                >
                  +
                </Button>
              </View>
            </View>

          </View>
        )}
        style={GlobalStyles.cartList}
      />

      <View>
        <Text>סה"כ: ₪{totalPrice.toFixed(2)}</Text>
      </View>

      <Button mode="outlined" onPress={() => router.push('/CheckOutPage')}>
        המשך לתשלום
      </Button>
    </View>
  );
};




export default MyCartPage;
