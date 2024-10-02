import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  TextInput,
  Button,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlobalStyles } from '../../constants/GlobalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const background = require('../../assets/images/loginBG.jpg');

const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
    try {
      const response = await axios.post('/users/login', { username, password });
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
        <SafeAreaView style={styles.safeArea}>
          <View style={GlobalStyles.formContainer}>
            <TextInput
              style={styles.input}
              mode="flat"
              label="Username"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} />} />}
            />
            <TextInput
              mode="flat"
              label="Password"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} />} />}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
              <Button
                onPress={() => router.push("/Authentication/ForgotPasswordPage")}
                color="navy"
                labelStyle={styles.buttonText}
              >
                Forgot Password?
              </Button>
              <Button
                onPress={() => router.push("/Authentication/SignUpPage")}
                color="navy"
                labelStyle={styles.buttonText}
              >
                New user? Sign Up
              </Button>
            </View>
            <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
              Login
            </Button>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 18,
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loginButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default LoginPage;
