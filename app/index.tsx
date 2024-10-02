import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFonts from '../constants/UseFonts'; // Ensure you have a font loader if needed

export default function Index() {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const fontsLoaded = useFonts(); // Load fonts if necessary

  // Check if the user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Simulate loading delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));

        const token = await AsyncStorage.getItem('accessToken'); // Ensure this matches the key used to store the token
        setIsLoggedIn(!!token); // Check login status
      } catch (e) {
        console.error('Failed to load login status.', e);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    checkLoginStatus();
  }, []);

  // Handle routing based on login status and font loading
  useEffect(() => {
    if (!isLoading && fontsLoaded !== null) { // Added extra check for null condition
      if (isLoggedIn) {
        router.push('/(drawer)/LandingPage'); // Navigate to Profile if logged in
      } else {
        router.push('/Authentication/LoginPage'); // Navigate to Login if not logged in
      }
    }
  }, [isLoading, isLoggedIn, fontsLoaded]);

  // If still loading or fonts are not loaded, show spinner
  if (isLoading || fontsLoaded === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#11d3ac" />
      </View>
    );
  }

  return null; // When loading finishes, routing will happen, so no need to render anything
}

// Styles for the loading screen
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
