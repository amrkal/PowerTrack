import React from "react";
import { View, } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";

const ForgotPasswordPage: React.FC = () => {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Forgot Password</Text>
      <Text style={GlobalStyles.text}>
        Enter your email address.
      </Text>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={GlobalStyles.button}>
        <Button  onPress={() => { /* Handle password reset */ }} >Reset Password</Button>
      </View>
    </View>
  );
};

export default ForgotPasswordPage;
