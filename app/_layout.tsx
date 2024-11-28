import React from 'react';
import { Stack } from 'expo-router';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors'; // Import custom colors
import merge from 'deepmerge'; // Deepmerge for combining themes
import useFonts from '../constants/UseFonts'; // Your custom hook to load fonts

// Import correct navigation themes
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Customizing React Native Paper themes with your custom colors
const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...Colors.dark,  // Merge with custom dark colors
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    regular: { fontFamily: 'Roboto-Regular' },
    medium: { fontFamily: 'Roboto-Bold' },
  },
  components: {
    TextInput: {
      contentStyle: {
        textAlign: 'center', // Center text horizontally
        paddingVertical: 0, // Remove vertical padding
        paddingHorizontal: 0, // Remove horizontal padding
      },
    },
  },
};

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...Colors.light,  // Merge with custom light colors
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: { fontFamily: 'Roboto-Regular' },
    medium: { fontFamily: 'Roboto-Bold' },
  },
  components: {
    TextInput: {
      contentStyle: {
        textAlign: 'center', // Center text horizontally
        paddingVertical: 0, // Remove vertical padding
        paddingHorizontal: 0, // Remove horizontal padding
      },
    },
  },
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// Merge React Native Paper and React Navigation themes
const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useFonts(); // Ensure fonts are loaded

  if (!fontsLoaded) {
    return null; // Or show a loading screen
  }

  const paperTheme = colorScheme === 'light' ? CombinedLightTheme : CombinedDarkTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Authentication" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </PaperProvider>
  );
}
