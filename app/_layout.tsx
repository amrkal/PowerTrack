import React, { useEffect, useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Stack } from 'expo-router';
import useFonts from '../constants/UseFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1e3755',
    secondary: '#dbdbdc',
    tertiary: '#f5f5f5',
    background: '#f5f5f5',
    onPrimary : '#ffffff',
  },
};

export const unstable_settings = {
  initialRouteName: "Authentication",
};

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const fontsLoaded = useFonts();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token); // Assign a boolean value (true/false) based on token existence
      } catch (e) {
        console.error('Failed to load token.', e);
      }
    };

    checkLoginStatus();
  }, []);

  if (!fontsLoaded || isLoggedIn === null) {
    return null; // Or render a loading spinner
  }

  return (
    <PaperProvider theme={theme}>
    <StatusBar style="dark" />
    <Stack>
      {isLoggedIn ? (
        <Stack.Screen
          name="(drawer)/MyCartPage"
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Authentication"
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="CheckDelivery" options={{ headerShown: false }} />
    </Stack>
    </PaperProvider>
  );
}
