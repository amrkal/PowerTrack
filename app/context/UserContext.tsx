// userContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../services/axiosInstance';

interface User {
  name: string;
  familyName: string;
  phone_number?: string;
  email: string;
  address: string;
  zip_code: string;
  city: string;
  profileImage: string;
  prices_tag?: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  fetchProfileData: () => Promise<void>;
  updateProfileData: (updatedUser: User) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

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

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }

      const response = await axiosInstance.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
        profileImage: userData.profile_image,
        prices_tag: userData.prices_tag,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (updatedUser: User) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
  
      await axiosInstance.put('/users/profile', updatedUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Fetch the updated user from the server
      await fetchProfileData();
  
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  
  
  

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchProfileData, updateProfileData }}>
      {loading ? <Text>Loading...</Text> : children}
    </UserContext.Provider>
  );
};

export default UserContext; // Make sure to export the context as default if necessary
