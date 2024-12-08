import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Product and CartItem interfaces
interface Product {
  id: string;
  item_key: string;
  item_name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId?: string;
  image?: string;
}

interface CartItem extends Product {
  name: any;
  quantityInCart: number;
}

// Define CartContextProps interface
interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (id: string, quantityInCart: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Create the CartContext
const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Persist the cart in AsyncStorage
  const saveCartToStorage = async (updatedCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  };

  // Load the cart from AsyncStorage on initialization
  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  };

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Update storage whenever the cart changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Add item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantityInCart: cartItem.quantityInCart + item.quantityInCart }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  // Update item quantity in the cart
  const updateCartItem = (id: string, quantityInCart: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantityInCart } : item
      )
    );
  };

  // Remove item from the cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear the cart after purchase
  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook for CartContext
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
