import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { FontFamily } from './Fonts'; // Adjust the path if necessary

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          [FontFamily.regular]: require('../assets/fonts/Roboto-Regular.ttf'),
          [FontFamily.bold]: require('../assets/fonts/Roboto-Bold.ttf'),
          [FontFamily.italic]: require('../assets/fonts/Roboto-Italic.ttf'),
          [FontFamily.boldItalic]: require('../assets/fonts/Roboto-BoldItalic.ttf'),
          [FontFamily.light]: require('../assets/fonts/Roboto-Light.ttf'),
          [FontFamily.medium]: require('../assets/fonts/Roboto-Medium.ttf'),
          [FontFamily.thin]: require('../assets/fonts/Roboto-Thin.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts', error);
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
}
