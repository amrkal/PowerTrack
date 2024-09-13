import React, { useState } from "react";
import { Alert, Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback, View, StyleSheet, ImageBackground} from "react-native";
import { Text, TextInput, Button, } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { router, useNavigation } from "expo-router";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import parsePhoneNumberFromString from "libphonenumber-js";
import { Route } from "expo-router/build/Route";

// Import the background image
import background from '../../assets/background.jpg';

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
      <ImageBackground source={background} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.inputRow}>
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
              //style={GlobalStyles.searchBar}
              label={ "User Name" }
              mode="outlined"
              placeholder="username"
              value={username}
              onChangeText={setUsername}
              style={styles.inputFull}
            />
            <TextInput
              //style={GlobalStyles.searchBar}
              mode="outlined"
              label={"Email"}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.inputFull}
            />
            <TextInput
              mode="outlined"
              //style={GlobalStyles.searchBar}
              label={ "Password" }
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputFull}
            />
            <TextInput
             mode="outlined"
             //style={GlobalStyles.searchBar}
             label={"Phone Number"}
              // style={styles.input}
              placeholder="Phone Number"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.inputFull}
            />
            <Button mode= "contained" onPress={handleRegister} style={styles.registerButton}>Register</Button>
            <Button onPress={() => navigation.navigate("LoginPage")} style={styles.textButton}>Already have account?</Button>
            <Button onPress={testConnection} style={styles.textButton}>Test Connection</Button>
          </View>
          </ScrollView>
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
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center', 
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: 'navy',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  inputHalf: {
    flex: 1,
  },
  inputFull: {
    width: '100%',
    marginBottom: 15,
  },
  registerButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#003366', 
  },
  textButton: {
    marginTop: 10,
    color: '#003366', 
  },
});


export default SignUpPage;
