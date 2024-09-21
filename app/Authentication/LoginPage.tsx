  import React, { useState, useEffect } from 'react';
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
import background from '../../assets/background.jpg';


  

  type RootStackParamList = {
    LoginPage: undefined;
    SignUpPage: undefined;
    ForgotPasswordPage: undefined;
  };

  type LoginPageNavigationProp = StackNavigationProp<RootStackParamList, 'LoginPage'>;

  const baseURL = 'http://192.168.0.153:5000';
  axios.defaults.baseURL = baseURL;

  const LoginPage: React.FC = (route) => {
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
              router.push('/(drawer)/ProductsPage');
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

        <SafeAreaView style={styles.safeArea}>
          
          <View style={GlobalStyles.formContainer}>
            <TextInput
              style={styles.input}
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
              // style={GlobalStyles.searchBar}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
            <Button onPress={() => router.push("/Authentication/ForgotPasswordPage") }
                                        color="navy"
                                        labelStyle={styles.buttonText}>
              Forgot Password?</Button>
            <Button onPress={() => router.push("/Authentication/SignUpPage")}
                            color="navy"
                            labelStyle={styles.buttonText}>
                              New user? Sign Up</Button>
            </View>
            <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
              Login
            </Button>
          </View>
        </SafeAreaView>
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

    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    input: {
      marginBottom: 18,
    },
    buttonText: {
      fontSize: 14,
      textAlign: 'center',
    },
    loginButton: {
     // backgroundColor: Color.primary,
      paddingVertical: 10, 
      borderRadius: 8,
      marginTop: 10, 
    },
  });

  export default LoginPage;
