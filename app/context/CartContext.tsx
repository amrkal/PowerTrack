import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the Product interface (your base item structure)
interface Product {
  id: string;
  item_key: string;
  item_name: string; // Keep 'item_name' for consistency
  description: string;
  price: number;
  quantity: number;
  categoryId?: string;
  image?: string;
}

// Define CartItem, extending from Product and adding cart-specific fields
interface CartItem extends Product {
  quantityInCart: number; // How many of this item is in the cart
}

// Define the CartContextProps interface
interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (id: string, quantityInCart: number) => void;
  removeFromCart: (id: string) => void;
}

// Create the CartContext
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Create the CartProvider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add an item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // If the item already exists in the cart, increase the quantityInCart
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantityInCart: cartItem.quantityInCart + item.quantityInCart }
            : cartItem
        );
      }
      // Add new item to the cart
      return [...prevCart, item];
    });
  };

  // Update the quantity of an item in the cart
  const updateCartItem = (id: string, quantityInCart: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantityInCart } : item
      )
    );
  };

  // Remove an item from the cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
