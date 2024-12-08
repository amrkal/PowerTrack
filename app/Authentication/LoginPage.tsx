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
      <KeyboardAwareScrollView
          contentContainerStyle={GlobalStyles.authScrollContent}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={220} // Minimal scroll adjustment
          enableOnAndroid={true}
          //scrollEnabled={false} // Disable user scroll gestures
        >
      <ImageBackground source={background} style={GlobalStyles.authBackground}>
          <View style={GlobalStyles.authContainer}>
            <TextInput
              mode="outlined"
              label="שם משתמש"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={GlobalStyles.authInput}
              left={<TextInput.Icon icon="account" color="blue" />}
            />
            <TextInput
              mode="outlined"
              label="סיסמה"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={GlobalStyles.authInput}
              left={<TextInput.Icon icon="lock" color="blue"/>}
            />
            <View style={GlobalStyles.authRow}>
              <Button
                onPress={() => router.push("/Authentication/ForgotPasswordPage")}
              >
                שכחתי סיסמה?
              </Button>
              <Button
                onPress={() => router.push("/Authentication/SignUpPage")}
              >
                משתמש חדש? להרשמה
              </Button>
            </View>
            <Button
              mode="contained"
              onPress={handleLogin}
            >
              כניסה
            </Button>
          </View>
      </ImageBackground>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;
