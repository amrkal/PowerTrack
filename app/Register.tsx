import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from 'expo-router';

const Registration: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const navigation = useNavigation();

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/; // Simple validation for 10-digit phone number
    return phoneRegex.test(phone);
  };

  const handleRegister = () => {
    if (validatePhoneNumber(phoneNumber)) {
      setIsSubmitted(true);
      Alert.alert('Success', 'Phone number registered successfully!');
      // Here, you would typically send the phone number to your backend server
    } else {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Enter your phone number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10} // Limiting the input to 10 digits
        />
        <Button title="Register" onPress={handleRegister} />
        {isSubmitted && <Text style={styles.success}>Registration Successful!</Text>}
        <Button title="Go to Another Page" onPress={() => navigation.navigate('main')} />
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

export default Registration;
