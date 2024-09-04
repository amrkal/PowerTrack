import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { GlobalStyles } from '../../constants/GlobalStyles';

const mailto = 'info@hashmalharama.com';
const tel = '046981130';
const locationUrl = 'https://maps.app.goo.gl/9uJkfanmxPkdifCi7';

const ContactUsPage: React.FC = () => {
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${mailto}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${tel}`);
  };

  const handleLocationPress = () => {
    Linking.openURL(locationUrl);
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={styles.subHeader}>We'd love to hear from you!</Text>

      <View style={styles.contactItem}>
        <IconButton icon="email" size={20} onPress={handleEmailPress} />
        <Text style={styles.contactText} onPress={handleEmailPress}>
          {mailto}
        </Text>
      </View>

      <View style={styles.contactItem}>
        <IconButton icon="phone" size={20} onPress={handlePhonePress} />
        <Text style={styles.contactText} onPress={handlePhonePress}>
          {tel}
        </Text>
      </View>

      <View style={styles.contactItem}>
        <IconButton icon="map-marker" size={20} onPress={handleLocationPress} />
        <Text style={styles.contactText} onPress={handleLocationPress}>
          איזור תעשייה, Majdal Shams, IL
        </Text>
      </View>

      <Text style={styles.formHeader}>Send Us a Message</Text>
      <TextInput
        label="Your Name"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Your Email"
        mode="outlined"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Message"
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <Button mode="contained" onPress={() => alert('Message Sent!')} style={styles.submitButton}>
        Send Message
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#0000EE',
    textDecorationLine: 'underline',
    marginLeft: 8,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
});

export default ContactUsPage;
