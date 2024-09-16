import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { View, Text } from 'react-native';

// Define the shape of the user data
interface User {
  name: string;
  familyName: string;
  email: string;
  address: string;
  zip_code: string;
  city: string;
  profileImage: string;
  prices_tag?: string;
}

// Define the context type, including both the user and functions to interact with the user state
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  fetchProfileData: () => Promise<void>;
  updateProfileData: (updatedUser: User) => Promise<void>;
}

// Create a context with undefined as the default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component to wrap the app
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: '',
    familyName: '',
    email: '',
    address: '',
    zip_code: '',
    city: '',
    profileImage: '',
    prices_tag: '',

  });
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch user profile data from the backend
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }

      const response = await axios.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send JWT token in headers
        },
      });

      const userData = response.data;
      setUser({
        ...user,
        name: userData.name,
        familyName: userData.familyName,
        email: userData.email,
        address: userData.address,
        zip_code: userData.zip_code,
        city: userData.city,
        profileImage: userData.photo,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update user profile data
  const updateProfileData = async (updatedUser: User) => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }

      await axios.put('/users/profile', updatedUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update the user state with the new data
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch profile data when the component mounts
    fetchProfileData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchProfileData, updateProfileData }}>
      {loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
  
};
