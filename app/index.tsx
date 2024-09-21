import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFonts from '../constants/UseFonts'; // Ensure you have a font loader if needed

export default function Index() {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const fontsLoaded = useFonts(); // Load fonts if necessary

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Simulate loading delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));

        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token); // Check login status
      } catch (e) {
        console.error('Failed to load login status.', e);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      if (isLoggedIn) {
        router.push('/(drawer)/ProfilePage'); // Navigate to Profile if logged in
      } else {
        router.push('/Authentication/LoginPage'); // Navigate to Login if not logged in
      }
    }
  }, [isLoading, isLoggedIn, fontsLoaded]);

  if (isLoading || !fontsLoaded) {
    return (
      <View>
        {/* Show a loading spinner while loading */}
        <ActivityIndicator size="large" color="#11d3ac" />
      </View>
    );
  }

  return null; // When loading finishes, routing will happen, so no need to render anything
}

