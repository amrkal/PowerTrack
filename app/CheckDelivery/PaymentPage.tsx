import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, RadioButton, useTheme, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';


const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [amount, setAmount] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [checkImage, setCheckImage] = useState<string | null>(null);
  const { colors } = useTheme();

  const handlePayment = () => {
    if (paymentMethod === 'card' && cardNumber && expiryDate && cvv && nameOnCard && amount) {
      alert('Credit card payment processed successfully!');
    } else if (paymentMethod === 'check' && checkImage && amount) {
      alert('Check payment processed successfully!');
    } else if (paymentMethod === 'bank' && bankAccountNumber && bankName && amount) {
      alert('Bank transfer payment processed successfully!');
    } else {
      alert('Please fill in all the fields.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    // Check if the user selected an image and result is not cancelled
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCheckImage(result.assets[0].uri); // Get the URI from the first selected asset
    }
  };
  

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.header}>Payment Details</Text>

          {/* Payment Method Selection */}
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Select Payment Method:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setPaymentMethod(newValue)}
              value={paymentMethod}
            >
              <View style={styles.radioOption}>
                <RadioButton value="card" />
                <Text>Credit Card</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="check" />
                <Text>Pay by Check</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="bank" />
                <Text>Bank Transfer</Text>
              </View>
            </RadioButton.Group>
          </View>

          {/* Credit Card Form */}
          {paymentMethod === 'card' && (
            <>
              <TextInput
                label="Name on Card"
                value={nameOnCard}
                onChangeText={setNameOnCard}
                mode="outlined"
                style={styles.input}
                placeholder="John Doe"
              />

              <TextInput
                label="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                mode="outlined"
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
              />

              <View style={styles.row}>
                <TextInput
                  label="Expiry Date"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  mode="outlined"
                  style={[styles.input, styles.smallInput]}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                />
                <TextInput
                  label="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  mode="outlined"
                  style={[styles.input, styles.smallInput]}
                  placeholder="123"
                  secureTextEntry
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          {/* Check Payment Form */}
          {paymentMethod === 'check' && (
            <>
              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                mode="outlined"
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
              />

              <Button mode="contained" onPress={pickImage} style={styles.button} color={colors.primary}>
                {checkImage ? 'Check Image Uploaded' : 'Upload Check Image'}
              </Button>
              {checkImage && (
                <View style={styles.imagePreview}>
                <IconButton
                  icon="check-circle"
                  iconColor="green" // `iconColor` instead of `color`
                />

                  <Text>Image selected!</Text>
                </View>
              )}
            </>
          )}

          {/* Bank Transfer Form */}
          {paymentMethod === 'bank' && (
            <>
              <TextInput
                label="Bank Name"
                value={bankName}
                onChangeText={setBankName}
                mode="outlined"
                style={styles.input}
                placeholder="Enter Bank Name"
              />

              <TextInput
                label="Bank Account Number"
                value={bankAccountNumber}
                onChangeText={setBankAccountNumber}
                mode="outlined"
                style={styles.input}
                placeholder="Enter Account Number"
                keyboardType="numeric"
              />

              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                mode="outlined"
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
              />
            </>
          )}

          <Button mode="contained" onPress={handlePayment} style={styles.button} color={colors.primary}>
            Submit Payment
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioLabel: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    width: '48%',
  },
  button: {
    marginTop: 10,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default PaymentPage;
