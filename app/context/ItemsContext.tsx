import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import axios from 'axios';

const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;

// Define the context
interface ItemsContextProps {
  items: any[];
  loading: boolean;
  loadItems: (prices_tag: number | string) => void;
}

// Create the ItemsContext
const ItemsContext = createContext<ItemsContextProps | undefined>(undefined);

// Provider component
interface ItemsProviderProps {
  children: ReactNode;
}

export const ItemsProvider: React.FC<ItemsProviderProps> = ({ children }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async (prices_tag: number | string) => {
    console.log('loadItems called with prices_tag:', prices_tag);

    try {
      console.log(`Sending request to ${baseURL}/items/items with prices_tag: ${prices_tag}`);
      const response = await axios.get('/items/items', { params: { prices_tag } });
      
      console.log('Response received:', response);
      
      if (response.data && response.data.items) {
        setItems(response.data.items);
        console.log('Items loaded:', response.data.items);
      } else {
        console.log('No items found in the response.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('ItemsProvider mounted');
    return () => {
      console.log('ItemsProvider unmounted');
    };
  }, []);

  return (
    <ItemsContext.Provider value={{ items, loading, loadItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the context
export const useItems = (): ItemsContextProps => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  console.log('useItems hook used');
  return context;
};
