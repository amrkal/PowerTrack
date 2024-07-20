import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Register: undefined;
  MainPage: undefined;
};

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
      setIsSubmitted(true);
      console.log('Registration Response:', response.data);
      Alert.alert('Success', response.data.message);
      navigation.navigate('MainPage');
    } catch (err) {
      console.error('Registration Error:', err);
      if (axios.isAxiosError(err)) {
        Alert.alert('Error', err.response?.data?.error || 'Failed to register user');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  const sendVerificationCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    try {
      console.log('Sending verification code to:', phoneNumber);
      const response = await axios.post('/auth/send-code', { phone_number: phoneNumber });
      console.log('Verification Code Response:', response.data);
      Alert.alert('Verification code sent');
    } catch (err) {
      console.error('Send Verification Code Error:', err);
      Alert.alert('Error', 'Failed to send verification code');
    }
  };

  const verifyCode = async () => {
    if (!phoneNumber || !verificationCode) {
      Alert.alert('Error', 'Phone number and code are required');
      return;
    }

    try {
      console.log('Verifying code for:', phoneNumber);
      const response = await axios.post('/auth/verify-code', {
        phone_number: phoneNumber,
        code: verificationCode,
      });
      console.log('Verify Code Response:', response.data);
      if (response.data.verified) {
        setIsVerified(true);
        Alert.alert('Phone number verified successfully!');
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (err) {
      console.error('Verify Code Error:', err);
      Alert.alert('Error', 'Failed to verify code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Family Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Family Name"
          value={familyName}
          onChangeText={setFamilyName}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Phone Number:</Text>
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
        <Button title="Test Connection" onPress={testConnection} />
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

export default Register;
