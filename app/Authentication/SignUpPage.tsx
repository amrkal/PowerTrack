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
import axiosInstance from '../../services/axiosInstance';
import { StackNavigationProp } from "@react-navigation/stack";
import parsePhoneNumberFromString from "libphonenumber-js";
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// תמונת הרקע
const background = require('../../assets/images/loginBG.jpg');

type RootStackParamList = {
  SignUpPage: undefined;
  LoginPage: undefined;
  VerificationPage: { phoneNumber: string };
};

type SignUpPageNavigationProp = StackNavigationProp<RootStackParamList, 'SignUpPage'>;

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
      Alert.alert('שגיאה', 'אנא מלאו את כל השדות.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('שגיאה', 'אנא הזינו מספר טלפון חוקי.');
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
      const response = await axiosInstance.post('/auth/register', {
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
        Alert.alert('שגיאה', err.response?.data?.error || 'הרישום נכשל');
      } else {
        Alert.alert('שגיאה', 'אירעה שגיאה לא צפויה');
      }
    }
  };

  return (
    <KeyboardAwareScrollView
          contentContainerStyle={GlobalStyles.authScrollContent}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
          enableOnAndroid={true}
          //scrollEnabled={false} // Disable user scroll gestures
        >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={background} style={GlobalStyles.authBackground}>
            <View style={GlobalStyles.authContainer}>
              {/* שם פרטי ושם משפחה */}
              <View style={GlobalStyles.authRow}>
                <TextInput
                  label="שם פרטי"
                  mode="outlined"
                  placeholder="שם פרטי"
                  value={name}
                  onChangeText={setName}
                  style={{ flex: 1, marginRight: 8 }} // תופס חצי מהשטח
                  left={<TextInput.Icon icon={() => <MaterialIcons name="account-circle" size={20} />} />}
                />
                <TextInput
                  mode="outlined"
                  label="שם משפחה"
                  placeholder="שם משפחה"
                  value={familyName}
                  onChangeText={setFamilyName}
                  style={{ flex: 1 }} // תופס את החצי השני
                  left={<TextInput.Icon icon={() => <MaterialIcons name="account-circle" size={20} />} />}
                />
              </View>

              {/* שם משתמש */}
              <TextInput
                label="שם משתמש"
                mode="outlined"
                placeholder="שם משתמש"
                value={username}
                onChangeText={setUsername}
                style={GlobalStyles.authInput}
                left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} />} />}
              />

              {/* אימייל */}
              <TextInput
                mode="outlined"
                label="אימייל"
                placeholder="אימייל"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={GlobalStyles.authInput}
                left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} />} />}
              />

              {/* סיסמה */}
              <TextInput
                mode="outlined"
                label="סיסמה"
                placeholder="סיסמה"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={GlobalStyles.authInput}
                left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} />} />}
              />

              {/* מספר טלפון */}
              <TextInput
                mode="outlined"
                label="מספר טלפון"
                placeholder="מספר טלפון"
                keyboardType="numeric"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={GlobalStyles.authInput}
                left={<TextInput.Icon icon={() => <MaterialIcons name="phone" size={20} />} />}
              />

              {/* כפתור הרשמה */}
              <Button mode="contained" onPress={handleRegister}>
                הרשמה
              </Button>
              <Button onPress={() => navigation.navigate("LoginPage")}>
                כבר יש לך חשבון?
              </Button>
            </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
  );
};


export default SignUpPage;
