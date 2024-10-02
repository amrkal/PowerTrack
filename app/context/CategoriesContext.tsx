import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the structure of the Category type
interface Category {
  id: string;
  name: string;
  sortGroup: string;
}

// Define the context type to store categories and loading state
interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
}

// Define the props for the CategoriesProvider, which include children
interface CategoriesProviderProps {
  children: ReactNode;
}

// Create the context
const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// Hook to use the CategoriesContext
export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

// CategoriesProvider component which accepts children as props
export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories/categories'); // Replace with your actual API endpoint
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {children}
    </CategoriesContext.Provider>
  );
};
