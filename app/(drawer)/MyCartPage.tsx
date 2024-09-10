import React from 'react';
import { Text, Button } from 'react-native-paper';
import { View, FlatList, Image } from 'react-native';
import { GlobalStyles } from '../../constants/GlobalStyles'; // Import GlobalStyles
import { useRouter } from 'expo-router'; // Import useRouter
import { useCart } from '../context/CartContext'; // Import CartContext

const MyCartPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const { cart, updateCartItem, removeFromCart } = useCart(); // Access cart context

  const handleDelete = (id: string) => {
    removeFromCart(id); // Remove item from cart using CartContext
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

  // Calculate total price from cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);

  return (
    <View style={GlobalStyles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyles.cartItem}>
          <Image source={item.image ? { uri: item.image } : require('../../assets/images/icon.png')}
          style={GlobalStyles.cartItemImage} />
          <View style={GlobalStyles.cartItemDetails}>
            {/* Make sure all text items are wrapped in <Text> */}
            <Text style={GlobalStyles.cartItemName}>{item.item_name}</Text>
            <Text style={GlobalStyles.cartItemPrice}>${item.price.toFixed(2)}</Text>
        
            <View style={GlobalStyles.quantityContainer}>
              <Button
                mode="contained"
                onPress={() => handleDecreaseQuantity(item.id)}
                style={{ marginRight: 5, minWidth: 5 }}
              >
                -
              </Button>
              {/* Ensure quantity is wrapped inside <Text> */}
              <Text variant="titleLarge" style={{ marginTop: 5 }}>{item.quantityInCart}</Text>
              <Button
                mode="contained"
                onPress={() => handleIncreaseQuantity(item.id)}
                style={{ marginLeft: 5, minWidth: 5 }}
              >
                +
              </Button>
            </View>
          </View>
          <Button
            style={GlobalStyles.deleteButton}
            labelStyle={{ fontSize: 16, lineHeight: 17 }}
            mode="contained"
            buttonColor="red"
            onPress={() => handleDelete(item.id)}
          >
            Delete
          </Button>
        </View>
        
        )}
        style={GlobalStyles.cartList}
      />

      <View style={GlobalStyles.totalContainer}>
        <Text style={GlobalStyles.totalText}>Total: ₪{totalPrice.toFixed(2)}</Text>
      </View>

      <View style={GlobalStyles.buttonsContainer}>
        <Button
          mode="contained-tonal"
          onPress={() => router.push('/CheckOutPage')}
        >
          Proceed to Checkout
        </Button>
      </View>
    </View>
  );
};

export default MyCartPage;
