import React, { useState } from "react";
import { Alert, Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback, View,} from "react-native";
import { Text, TextInput, Button, } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { router, useNavigation } from "expo-router";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Route } from "expo-router/build/Route";


type RootStackParamList = {
  SignUpPage: undefined;
  LoginPage: undefined;
  VerificationPage:{ phoneNumber: string };
};

type SignUpPageNavigationProp = StackNavigationProp<RootStackParamList, 'SignUpPage'>;

const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const navigation = useNavigation<SignUpPageNavigationProp>();

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneNumber = parsePhoneNumberFromString(phone, 'IL');
    return phoneNumber?.isValid() || false;
  };

  const testConnection = async () => {
    try {
      const response = await axios.get('/');
      Alert.alert('Connection Successful', response.data.message || 'Connected to server');
    } catch (error:any) {
      Alert.alert('Connection Failed', error.message);
    }
  };

  const handleRegister = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    try {
      console.log('Attempting to register with:', { username, password, name, familyName, email, phoneNumber });
      const response = await axios.post('/auth/register', {
        username,
        password,
        name,
        family_name: familyName,
        email,
        phone_number: phoneNumber,
      });
      console.log('Registration Response:', response.data);
      navigation.navigate('VerificationPage', { phoneNumber });
    } catch (err) {
      console.error('Registration Error:', err);
      if (axios.isAxiosError(err)) {
        Alert.alert('Error', err.response?.data?.error || 'Failed to register user');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={GlobalStyles.container}>
          <View style={GlobalStyles.container}>
            <View style={{ flexDirection: 'row',  justifyContent: 'space-between' }} >
            <TextInput
              label={ "Name" }
              mode="outlined"
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={[{ flex: 1, marginRight: 8 }, GlobalStyles.searchBar]} // Takes up half of the space
            />
            <TextInput
              mode="outlined"
              label={ "Family Name" }
              placeholder="Family Name"
              value={familyName}
              onChangeText={setFamilyName}
              style={[{ flex: 1 }, GlobalStyles.searchBar]} // Takes up the other half of the space
            />
            </View>
            <TextInput
              style={GlobalStyles.searchBar}
              label={ "User Name" }
              mode="outlined"
              placeholder="username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={GlobalStyles.searchBar}
              mode="outlined"
              label={"Email"}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              mode="outlined"
              style={GlobalStyles.searchBar}
              label={ "Password" }
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
             mode="outlined"
             style={GlobalStyles.searchBar}
             label={"Phone Number"}
              // style={styles.input}
              placeholder="Phone Number"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <Button mode= "contained" onPress={handleRegister}>Register</Button>
            <Button onPress={() => navigation.navigate("LoginPage")}>Already have account?</Button>
            <Button onPress={testConnection}>Test Connection</Button>
          </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpPage;
