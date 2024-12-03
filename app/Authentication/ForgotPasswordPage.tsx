import React, { useState } from "react";
import { Alert, View, StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { MaterialIcons } from "@expo/vector-icons";

// Import the background image
const background = require('../../assets/images/loginBG.jpg');

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook

  const handlePasswordReset = () => {
    if (email) {
      axiosInstance.post('http://192.168.0.153:5000/resetPassword/reset-password', { email })
        .then(response => {
          Alert.alert('הצלחה', response.data.message);
        })
        .catch(error => {
          Alert.alert('שגיאה', error.response.data.message || 'אירעה שגיאה');
        });
    } else {
      Alert.alert('שגיאה', 'אנא הזן את כתובת האימייל שלך');
    }
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <IconButton
          icon="arrow-left" // Changed to right-facing arrow for Hebrew
          size={24}
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        />
        <View style={styles.container}>
          <Text style={{ marginBottom: 10, textAlign: 'right' }}>
            הזן את כתובת האימייל שלך
          </Text>
          <TextInput
            placeholder="אימייל"
            value={email}
            mode="outlined"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlign="right"
            left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} />} />}
          />
          <Button style={{ marginTop: 10 }} mode="contained" onPress={handlePasswordReset}>
            איפוס סיסמה
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
    justifyContent: 'center', // Ensures the container is vertically centered
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute', // Ensures the back button is not part of the flow
    top: 60,
    left: 20, // Moves it to the right for Hebrew layout
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    elevation: 5,
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
});

export default ForgotPasswordPage;
