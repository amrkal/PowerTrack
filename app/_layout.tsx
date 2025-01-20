import React from 'react';
import { Stack } from 'expo-router';
import { CustomThemeProvider } from './context/ThemeContext';

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Authentication" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Profile" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </CustomThemeProvider>
  );
}
