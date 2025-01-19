import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import merge from 'deepmerge';

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  // Rename this import to avoid conflicting with your own ThemeProvider
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';

import { Colors } from '../../constants/Colors';

// 1. Merge Paper + Navigation themes with custom colors
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...Colors.light,
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...Colors.dark,
  },
};

const CombinedLightTheme = merge(NavigationDefaultTheme, customLightTheme) as any;
const CombinedDarkTheme = merge(NavigationDarkTheme, customDarkTheme) as any;

// 2. Context interface
interface ThemeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  changeLanguage: (lang: string) => void;
}

// 3. Create your own Theme Context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// 4. Rename your component to avoid name clash
export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');
  const [language, setLanguage] = useState('עברית');

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('darkMode');
        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedTheme) setIsDarkMode(JSON.parse(storedTheme));
        if (storedLanguage) setLanguage(storedLanguage);
      } catch (error) {
        console.error('Failed to load theme or language preference:', error);
      }
    };
    loadPreferences();
  }, []);

  const toggleDarkMode = async () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newVal));
  };

  const changeLanguage = async (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    await AsyncStorage.setItem('language', selectedLanguage);
  };

  // Choose light or dark
  const paperTheme = isDarkMode ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, language, changeLanguage }}>
      {/* 
        If you DO want to use both React Navigation’s ThemeProvider
        and Paper’s PaperProvider, do something like this:
      */}
      <NavigationThemeProvider value={paperTheme}>
        <PaperProvider theme={paperTheme}>
          <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
              translucent
            />
            {children}
          </View>
        </PaperProvider>
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
};

// 5. Hook to consume your custom context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
};
