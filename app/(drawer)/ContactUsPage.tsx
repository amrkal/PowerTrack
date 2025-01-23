import { GlobalStyles } from '@/constants/GlobalStyles';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, Linking, Dimensions } from 'react-native';
import { Text, IconButton, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const mailto = 'info@hashmalharama.com';
const tel = '04-6981130';
const whatsappNumber = '052-4637165';
const locationUrl = 'https://maps.app.goo.gl/9uJkfanmxPkdifCi7';



const ContactUsPage: React.FC = () => {

  const navigation = useNavigation<any>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign
          name="bars"
          size={30}
          color="#1E3A8A"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      ),
      headerLeft: () => null, // Hide the default header
    });
  }, [navigation]);
  
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
    <View>
      {/* Contact Info Section */}
      <Card style={GlobalStyles.contactCard}>
        <Card.Content>
          <Text style={GlobalStyles.header}>Contact Us</Text>
          <Text style={GlobalStyles.subHeader}>We'd love to hear from you!</Text>

          {/* WhatsApp Contact */}
          <View style={GlobalStyles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="whatsapp" {...props} color="#25D366" />
              )}
              size={24}
              onPress={handleWhatsAppPress}
            />
            <Text style={GlobalStyles.contactText} onPress={handleWhatsAppPress}>
              {whatsappNumber}
            </Text>
          </View>

          {/* Email Contact */}
          <View style={GlobalStyles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="email" {...props} color="#1E90FF" />
              )}
              size={24}
              onPress={handleEmailPress}
            />
            <Text style={GlobalStyles.contactText} onPress={handleEmailPress}>
              {mailto}
            </Text>
          </View>


          {/* Phone Contact */}
          <View style={GlobalStyles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="phone" {...props} color="#1E90FF" />
              )}
              size={24}
              onPress={handlePhonePress}
            />
            <Text style={GlobalStyles.contactText} onPress={handlePhonePress}>
              {tel}
            </Text>
          </View>

          {/* Location Contact */}
          <View style={GlobalStyles.contactItem}>
            <IconButton
              icon={(props) => (
                <MaterialCommunityIcons name="map-marker" {...props} color="#FF5733" />
              )}
              size={24}
              onPress={handleLocationPress}
            />
            <Text style={GlobalStyles.contactText} onPress={handleLocationPress}>
              איזור תעשייה, Majdal Shams, IL
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};


export default ContactUsPage;
