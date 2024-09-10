  import React, { useState, useEffect } from 'react';
  import {
    SafeAreaView,
    View,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
  } from 'react-native';
  import {
    Text,
    TextInput,
    Button,
  } from 'react-native-paper';
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useNavigation } from '@react-navigation/native';
  import { StackNavigationProp } from '@react-navigation/stack';
  import { Color } from '../../constants/Color';
  import { GlobalStyles } from '../../constants/GlobalStyles';
import { router } from 'expo-router';



  type RootStackParamList = {
    LoginPage: undefined;
    SignUpPage: undefined;
    ForgotPasswordPage: undefined;
  };

  type LoginPageNavigationProp = StackNavigationProp<RootStackParamList, 'LoginPage'>;

  const baseURL = 'http://192.168.0.153:5000';
  axios.defaults.baseURL = baseURL;

  const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<LoginPageNavigationProp>();

    useEffect(() => {
      // Check if user is already logged in
      const checkLoginStatus = async () => {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedUsername && savedPassword) {
          // Validate the stored credentials with the server
          try {
            const response = await axios.post('/users/login', { username: savedUsername, password: savedPassword });
            if (response.data) {
              router.push('/(drawer)/MyCartPage');
            }
          } catch (error) {
            // Handle login failure
          }
        }
      };

      checkLoginStatus();
    }, []);

    const handleLogin = async () => {
      try {
        const response = await axios.post('/users/login', { username, password });
    
        // Extract the access_token from the response
        const { access_token } = response.data;
    
        // Save the login details and token
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        
        if (access_token) {
          await AsyncStorage.setItem('accessToken', access_token);  // Save the JWT token
          console.log('Access token saved');
        }
    
        // Navigate to the Products page after successful login
        router.push('/(drawer)/ProductsPage');
      } catch (error) {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={GlobalStyles.container}>
          <View style={GlobalStyles.container}>
            <TextInput
              style={GlobalStyles.searchBar}
              mode = "outlined"
              label={"Username"}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              mode = "outlined"
              label={"Password"}
              style={GlobalStyles.searchBar}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
            <Button onPress={() => navigation.navigate("ForgotPasswordPage") }>Forgot Password?</Button>
            <Button onPress={() => navigation.navigate("SignUpPage")}>New user? Sign Up</Button>
            </View>
            <Button mode ="outlined" onPress={handleLogin}>Login</Button>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  };

  export default LoginPage;
