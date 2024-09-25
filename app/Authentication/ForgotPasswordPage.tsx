import React, { useState } from "react";
import { Alert, View,StyleSheet, SafeAreaView , ImageBackground} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { GlobalStyles } from "../../constants/GlobalStyles";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

// Import the background image


const background = require('../../assets/images/loginBG.jpg');

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
      <View style={GlobalStyles.container}>
      <Text style={{ marginBottom: 20, color: 'green' }}>
        Enter your email address.
      </Text>
      <TextInput
        // style={GlobalStyles.searchBar}
        placeholder="Email"
        value={email}
        mode="outlined"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} />} />} // Icon for username
      />
        <Button style={{ marginTop: 10 }} mode="contained" onPress={handlePasswordReset}> {/* Correctly call the function here */}
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
});




export default ForgotPasswordPage;
