import React, { useState } from "react";
import { Alert, View, } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";
import axios from "axios";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    if (email) {
      axios.post('http://192.168.0.153:5000/resetPassword/reset-password', { email })
        .then(response => {
          Alert.alert('Success', response.data.message);
        })
        .catch(error => {
          Alert.alert('Error', error.response.data.message || 'An error occurred');
        });
    } else {
      Alert.alert('Error', 'Please enter your email address');
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.text}>
        Enter your email address.
      </Text>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
        <Button mode="contained" onPress={handlePasswordReset}> {/* Correctly call the function here */}
          Reset Password
        </Button>
    </View>
  );
};

export default ForgotPasswordPage;
