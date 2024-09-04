import React, { useState } from "react";
import { View, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

type RootStackParamList = {
  SignUpPage: undefined;
  LoginPage: undefined;
  VerificationPage: { phoneNumber: string };
};

type VerificationPageNavigationProp = StackNavigationProp<RootStackParamList, 'VerificationPage'>;


const VerificationPage: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'VerificationPage'>>();
  const navigation = useNavigation<VerificationPageNavigationProp>();
  const { phoneNumber } = route.params;  // Retrieve the phone number from route params
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const sendVerificationCode = async () => {
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
        navigation.navigate("LoginPage"); // Or navigate to the next page
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (err) {
      console.error('Verify Code Error:', err);
      Alert.alert('Error', 'Failed to verify code');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Verification</Text>
      <Text style={GlobalStyles.text}>Please enter the verification code sent to your phone.</Text>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Enter Verification Code"
        keyboardType="numeric"
        maxLength={6}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <View>
        <Button mode="outlined" onPress={sendVerificationCode}>
          Resend Code
        </Button>
        <Button mode="contained" onPress={verifyCode}>
          Verify Code
        </Button>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};


export default VerificationPage;














 /* try {
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
    navigation.navigate('LoginPage');
  } catch (err) {
    console.error('Registration Error:', err);
    if (axios.isAxiosError(err)) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to register user');
    } else {
      Alert.alert('Error', 'An unexpected error occurred');
    }

  }
  const sendVerificationCode = async () => {


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
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Verification</Text>
      <Text style={GlobalStyles.text}>Please enter the verification code sent to your email.</Text>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Enter Verification Code"
        keyboardType="numeric"
        maxLength={6}
      />
      <View style={GlobalStyles.button}>
      <TextInput
              // style={styles.input}
              mode="outlined"
              label={"Verification Code"}
              placeholder="Verification Code"
              keyboardType="numeric"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            <Button onPress={verifyCode}>Verify Code</Button>
      </View>
    </View>
  );
};
*/