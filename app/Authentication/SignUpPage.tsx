import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { router, useNavigation } from "expo-router";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import parsePhoneNumberFromString from "libphonenumber-js";
import { MaterialIcons } from "@expo/vector-icons";

// Import the background image
const background = require('../../assets/images/loginBG.jpg');

type RootStackParamList = {
  SignUpPage: undefined;
  LoginPage: undefined;
  VerificationPage: { phoneNumber: string };
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

  const handleRegister = async () => {
    if (!name || !familyName || !username || !email || !password || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    try {
      console.log('Attempting to register with:', {
        username,
        password,
        name,
        familyName,
        email,
        phoneNumber,
      });
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
            <View style={GlobalStyles.container}>
              {/* Name and Family Name */}
              <View style={styles.inputRow}>
                <TextInput
                  label="Name"
                  mode="outlined"
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  style={{ flex: 1, marginRight: 8 }} // Takes up half of the space
                  left={<TextInput.Icon icon={() => <MaterialIcons name="account-circle" size={20} />} />} // Icon for name
                />
                <TextInput
                  mode="outlined"
                  label="Family Name"
                  placeholder="Family Name"
                  value={familyName}
                  onChangeText={setFamilyName}
                  style={{ flex: 1 }} // Takes up the other half of the space
                  left={<TextInput.Icon icon={() => <MaterialIcons name="account-circle" size={20} />} />} // Icon for family name
                />
              </View>

              {/* Username */}
              <TextInput
                label="Username"
                mode="outlined"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.inputFull}
                left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} />} />} // Icon for username
              />

              {/* Email */}
              <TextInput
                mode="outlined"
                label="Email"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.inputFull}
                left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} />} />} // Icon for email
              />

              {/* Password */}
              <TextInput
                mode="outlined"
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputFull}
                left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} />} />} // Changed icon to "lock" for password
              />

              {/* Phone Number */}
              <TextInput
                mode="outlined"
                label="Phone Number"
                placeholder="Phone Number"
                keyboardType="numeric"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.inputFull}
                left={<TextInput.Icon icon={() => <MaterialIcons name="phone" size={20} />} />} // Icon for phone number
              />

              {/* Register Button */}
              <Button mode="contained" onPress={handleRegister} style={styles.registerButton}>
                Register
              </Button>
              <Button onPress={() => navigation.navigate("LoginPage")}>
                Already have an account?
              </Button>
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  inputFull: {
    width: '100%',
    marginBottom: 15,
  },
  registerButton: {
    width: '100%',
    marginTop: 20,
  },
});

export default SignUpPage;
