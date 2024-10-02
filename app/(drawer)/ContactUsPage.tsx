import React from 'react';
import { View, StyleSheet, Linking, Dimensions } from 'react-native';
import { Text, TextInput, Button, IconButton, Card } from 'react-native-paper';

// Get the device width
const { width } = Dimensions.get('window');

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
    <View style={styles.overlay}>
      {/* Contact Info Section */}
      <Card style={styles.contactCard}>
        <Card.Content>
          <Text style={styles.header}>Contact Us</Text>
          <Text style={styles.subHeader}>We'd love to hear from you!</Text>

          {/* Email Contact */}
          <View style={styles.contactItem}>
            <IconButton icon="email" size={24} onPress={handleEmailPress} />
            <Text style={styles.contactText} onPress={handleEmailPress}>
              {mailto}
            </Text>
          </View>

          {/* Phone Contact */}
          <View style={styles.contactItem}>
            <IconButton icon="phone" size={24}  onPress={handlePhonePress} />
            <Text style={styles.contactText} onPress={handlePhonePress}>
              {tel}
            </Text>
          </View>

          {/* Location Contact */}
          <View style={styles.contactItem}>
            <IconButton icon="map-marker" size={24} onPress={handleLocationPress} />
            <Text style={styles.contactText} onPress={handleLocationPress}>
              איזור תעשייה, Majdal Shams, IL
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Contact Form Section */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.formHeader}>Send Us a Message</Text>

          {/* Name Input */}
          <TextInput
            label="Your Name"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#1E90FF' } }}
          />

          {/* Email Input */}
          <TextInput
            label="Your Email"
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            theme={{ colors: { primary: '#1E90FF' } }}
          />

          {/* Message Input */}
          <TextInput
            label="Message"
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            theme={{ colors: { primary: '#1E90FF' } }}
          />

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={() => alert('Message Sent!')}
            style={styles.submitButton}
            contentStyle={{ paddingVertical: 8 }}
          >
            Send Message
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#f0f4f7',
  },
  contactCard: {
    width: width > 600 ? '60%' : '90%',
    padding: 20,
    marginTop: 150, // Move contact container further down
    marginBottom: 10, // Reduce space between contact container and form container
    //backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderColor: '#1E90FF',
    borderWidth: 2,
  },
  formCard: {
    width: width > 600 ? '60%' : '90%',
    padding: 20,
    marginTop: 3, // Further reduce the space between form and contact containers
    marginBottom: 150, // Add more space below the form
    //backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderColor: '#1E90FF',
    borderWidth: 2,
  },
  header: {
    fontSize: width > 600 ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: 7,
    textAlign: 'center',
    //color: '#1E90FF',
  },
  subHeader: {
    fontSize: width > 600 ? 26 : 15,
    //color: '#1E90FF',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  contactText: {
    fontSize: width > 600 ? 18 : 16,
    //color: '#1E90FF',
    textDecorationLine: 'underline',
    marginLeft: 6,
  },
  formHeader: {
    fontSize: width > 600 ? 24 : 18,
    fontWeight: 'bold',
    marginVertical: 14,
    textAlign: 'center',
    //color: '#1E90FF',
  },
  input: {
    marginBottom: 15,
    fontSize: width > 600 ? 16 : 14,
    //backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 20,
    //backgroundColor: '#1E90FF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});


export default ContactUsPage;
