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
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
          enableOnAndroid={true}
          //scrollEnabled={false} // Disable user scroll gestures
        >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={background} style={styles.background}>
            <View style={styles.container}>
              {/* שם פרטי ושם משפחה */}
              <View style={styles.inputRow}>
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
                style={styles.inputFull}
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
                style={styles.inputFull}
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
                style={styles.inputFull}
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
                style={styles.inputFull}
                left={<TextInput.Icon icon={() => <MaterialIcons name="phone" size={20} />} />}
              />

              {/* כפתור הרשמה */}
              <Button mode="contained" onPress={handleRegister} style={styles.registerButton}>
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

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',    
  },
  safeArea: {
    flexGrow: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color:'#07090'
  },
  registerButton: {
    width: '100%',
    marginTop: 20,
  },
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
    width: '90%',
    alignSelf: 'center',
    borderColor: '#ffa64d',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    textAlign:'center',
  },
});

export default SignUpPage;
