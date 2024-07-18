import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  index: undefined;
  main: undefined;
};

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'index'>;
const baseURL = 'http://192.168.0.153:5000'; // Replace with your Flask server's local IP and port
axios.defaults.baseURL = baseURL;

const Registration: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const navigation = useNavigation<RegistrationScreenNavigationProp>();

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneNumber = parsePhoneNumberFromString(phone, 'IL');
    return phoneNumber?.isValid() || false;
  };

  const handleRegister = async () => {
    if (validatePhoneNumber(phoneNumber)) {
      try {
        const response = await axios.post('http://192.168.0.153:5000/register', {
          name,
          family_name: familyName,
          email,
          phone_number: phoneNumber,
        });
        setIsSubmitted(true);
        Alert.alert('Success', response.data.message);
        // Navigate to another page if needed
      } catch (err) {
        console.error('Registration Error:', err);
        if (axios.isAxiosError(err)) {
          Alert.alert('Error', err.response?.data?.error || 'Failed to register user');
        } else {
          Alert.alert('Error', 'An unexpected error occurred');
        }
      }
    } else {
      Alert.alert('Error', 'Please enter a valid phone number.');
    }
  };

  const sendVerificationCode = async () => {
    if (validatePhoneNumber(phoneNumber)) {
      try {
        const response = await axios.post('http://192.168.0.153:5000/send-code', {
          phone_number: phoneNumber,
        });
        console.log('Verification Code Response:', response.data);
        Alert.alert('Verification code sent');
      } catch (err: any) {
        console.error('Send Verification Code Error:', err);
        console.log('Error Response Data:', err.response?.data); // Log detailed error response
        Alert.alert('Error', 'Failed to send verification code');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid phone number.');
    }
  };

  const verifyCode = async () => {
    try {
      // Replace with your verification service endpoint
      const response = await axios.post('http://192.168.0.153:5000/verify-code', {
        phone_number: phoneNumber,
        code: verificationCode,
      });
      if (response.data.verified) {
        setIsVerified(true);
        Alert.alert('Phone number verified successfully!');
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (err: any) { // Explicitly specify the type here
      console.error('Verify Code Error:', err);
      Alert.alert('Error', 'Failed to verify code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Enter your name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Enter your family name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Family Name"
          value={familyName}
          onChangeText={setFamilyName}
        />
        <Text style={styles.label}>Enter your email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Enter your phone number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Button title="Send Verification Code" onPress={sendVerificationCode} />
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          keyboardType="numeric"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
        <Button title="Verify Code" onPress={verifyCode} />
        <Button title="Register" onPress={handleRegister} disabled={!isVerified} />
        {isSubmitted && <Text style={styles.success}>Registration Successful!</Text>}
        <Button title="Go to Main Page" onPress={() => navigation.navigate('main')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '80%',
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  success: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default Registration;
