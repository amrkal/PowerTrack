import React, { useState } from 'react';
import { Alert, View, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import axiosInstance from '../../services/axiosInstance';
import { GlobalStyles } from '@/constants/GlobalStyles';

// Background Image
const background = require('../../assets/images/loginBG.jpg');

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); 

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('שגיאה', 'אנא הזן את כתובת האימייל שלך');
      return;
    }

    try {
      const response = await axiosInstance.post('/resetPassword/reset-password', { email });
      Alert.alert('הצלחה', response.data.message);
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'אירעה שגיאה';
      Alert.alert('שגיאה', errorMessage);
    }
  };

  return (
    <ImageBackground source={background} style={GlobalStyles.authBackground}>
      <SafeAreaView style={GlobalStyles.authSafeArea}>
        <IconButton
          icon="arrow-left"
          size={24}
          style={GlobalStyles.authBackButton}
          onPress={() => navigation.goBack()}
        />
        <View style={GlobalStyles.authContainer}>
          <Text style={GlobalStyles.authInstructionText}>הזן את כתובת האימייל שלך</Text>

          <TextInput
            placeholder="אימייל"
            value={email}
            mode="outlined"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} />} />}
          />

          <Button mode="contained" onPress={handlePasswordReset}>
            איפוס סיסמה
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ForgotPasswordPage;
