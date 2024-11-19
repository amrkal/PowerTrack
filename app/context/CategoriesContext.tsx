// CategoriesContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axiosInstance from '../../services/axiosInstance';

interface Category {
  id: string;
  name: string;
  sortGroup: string;
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
}

interface CategoriesProviderProps {
  children: ReactNode;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories/categories'); // Replace with your actual API endpoint
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

export default CategoriesContext; // Default export
