import React from 'react';
import { View, StyleSheet, Linking, Dimensions } from 'react-native';
import { Text, IconButton, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Get the device width
const { width } = Dimensions.get('window');

const mailto = 'info@hashmalharama.com';
const tel = '04-6981130';
const whatsappNumber = '052-4637165';
const locationUrl = 'https://maps.app.goo.gl/9uJkfanmxPkdifCi7';

const ContactUsPage: React.FC = () => {
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${mailto}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${tel}`);
  };

  const handleWhatsAppPress = () => {
    Linking.openURL(`https://wa.me/972${whatsappNumber}`);
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

          {/* WhatsApp Contact */}
          <View style={styles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="whatsapp" {...props} color="#25D366" />
              )}
              size={24}
              onPress={handleWhatsAppPress}
            />
            <Text style={styles.contactText} onPress={handleWhatsAppPress}>
              {whatsappNumber}
            </Text>
          </View>

          {/* Email Contact */}
          <View style={styles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="email" {...props} color="#1E90FF" />
              )}
              size={24}
              onPress={handleEmailPress}
            />
            <Text style={styles.contactText} onPress={handleEmailPress}>
              {mailto}
            </Text>
          </View>

          {/* Phone Contact */}
          <View style={styles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="phone" {...props} color="#1E90FF" />
              )}
              size={24}
              onPress={handlePhonePress}
            />
            <Text style={styles.contactText} onPress={handlePhonePress}>
              {tel}
            </Text>
          </View>

          {/* Location Contact */}
          <View style={styles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="map-marker" {...props} color="#FF5733" />
              )}
              size={24}
              onPress={handleLocationPress}
            />
            <Text style={styles.contactText} onPress={handleLocationPress}>
              איזור תעשייה, Majdal Shams, IL
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  contactCard: {
    width: width > 600 ? '60%' : '90%',
    padding: 20,
    marginTop: 150,
    marginBottom: 10,
    backgroundColor: '#fff',
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
    color: '#1E90FF',
  },
  subHeader: {
    fontSize: width > 600 ? 26 : 15,
    color: '#ffa64d',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: width > 600 ? 18 : 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
    marginLeft: 6,
  },
});

export default ContactUsPage;
