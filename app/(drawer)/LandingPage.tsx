// app/LandingPage.tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';


const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 10000;


const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get('/items/items'); // Replace with your backend URL
        await AsyncStorage.setItem('cachedData', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <View>
      <Text>Welcome to the App!</Text>
      <Button title="Get Started" onPress={() => router.push('/ProductsPage')} />
    </View>
  );
};

export default LandingPage;
