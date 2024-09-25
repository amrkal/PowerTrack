import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the context state
interface ItemsContextType {
  items: Product[];
  loading: boolean;
}

// Define the Product interface
interface Product {
  id: string;
  item_key: string;
  item_name: string;
  description: string;
  price: number;
  currency: string;
  purch_price: number;
  quantity: number;
  discount_code: string;
  categoryId?: string;
  image?: string;
}

// Initialize the ItemsContext with default values
const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};

// Props interface for the provider
interface ItemsProviderProps {
  children: ReactNode; // Explicitly type children as ReactNode
}

export const ItemsProvider: React.FC<ItemsProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/items/items');
        setItems(response.data.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, loading }}>
      {children}  {/* children is now correctly typed */}
    </ItemsContext.Provider>
  );
};
