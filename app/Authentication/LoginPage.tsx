import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axiosInstance from '../../services/axiosInstance';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const background = require('../../assets/images/loginBG.jpg');

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme(); // Access React Native Paper theme
  
  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/users/login', { username, password });
      const { access_token } = response.data;

      // Save login details and token
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      if (access_token) {
        await AsyncStorage.setItem('accessToken', access_token);
        console.log('Access token saved');
      }

      // Navigate to the Landing page after successful login
      router.push('/(drawer)/LandingPage');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={background} style={styles.background}>
      <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={150} // Minimal scroll adjustment
          enableOnAndroid={true}
        >
          <View style={styles.formContainer}>
            <TextInput
              mode="outlined"
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              mode="outlined"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
            />
            <View style={styles.actionButtons}>
              <Button
                onPress={() => router.push("/Authentication/ForgotPasswordPage")}
                textColor={theme.colors.primary}
                labelStyle={styles.buttonText}
              >
                Forgot Password?
              </Button>
              <Button
                onPress={() => router.push("/Authentication/SignUpPage")}
                textColor={theme.colors.primary}
                labelStyle={styles.buttonText}
              >
                New user? Sign Up
              </Button>
            </View>
            <Button
              mode="contained"
              onPress={handleLogin}
              //buttonColor={theme.colors.primary}
            >
              Login
            </Button>
          </View>
          </KeyboardAwareScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '90%',  
    maxWidth: 500,
    padding: 30, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    position: 'absolute', // Make the formContainer positioned relative to its parent
    bottom: '15%', // Push the container 25% of the height of the screen up from the bottom
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Align content to the top
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Add some space from the top
    alignItems: 'center',
  },
});

export default LoginPage;
