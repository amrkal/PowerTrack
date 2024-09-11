import React, { useState } from "react";
import { Alert, View,StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";
import axios from "axios";

// Import the background image
import background from '../../assets/background.jpg';

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
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Text style={styles.text}>
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
      </SafeAreaView>
      </ImageBackground>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 36,
    textAlign: 'center',
    color: 'navy',
  },
  text: {
    fontSize: 16,
    marginBottom: 26,
    textAlign: 'left', 
    color: 'navy',
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#003366', 
  },
});




export default ForgotPasswordPage;
