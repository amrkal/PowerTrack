import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, PixelRatio , ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// Function to calculate responsive size based on screen width
const responsiveWidth = (value: number) => PixelRatio.roundToNearestPixel((width * value) / 100);
const responsiveHeight = (value: number) => PixelRatio.roundToNearestPixel((height * value) / 100);

const AboutUsPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo Image Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.jpg')} 
            style={styles.logoImage}
          />
        </View>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>About Us</Text>
        </View>

        {/* Collapsible Section: Welcome */}
        <TouchableOpacity onPress={() => toggleSection('welcome')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="store" size={24} />
            <Text style={styles.sectionHeader}>
              Welcome to <Text style={styles.boldText}>PowerTrack</Text>
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'welcome' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              Welcome to <Text style={styles.boldText}>PowerTrack</Text>, your trusted source for high-quality copper lines, electric pipes, and all types of tools. Whether you're a business looking for bulk purchases or an individual seeking the best prices, we've got you covered.
            </Text>
          </View>
        )}

        {/* Collapsible Section: Our Mission */}
        <TouchableOpacity onPress={() => toggleSection('mission')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="flag" size={24} />
            <Text style={styles.sectionHeader}>Our Mission</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'mission' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              Our mission is to provide our customers with top-notch products at unbeatable prices. We cater to both B2B and B2C clients, ensuring that everyone has access to the materials and tools they need to get the job done.
            </Text>
          </View>
        )}

        {/* Collapsible Section: What We Offer */}
        <TouchableOpacity onPress={() => toggleSection('offer')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="tools" size={24} />
            <Text style={styles.sectionHeader}>What We Offer</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'offer' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>• Copper Lines:</Text> Premium quality copper lines suitable for a wide range of electrical applications.
              {'\n'}
              <Text style={styles.boldText}>• Electric Pipes:</Text> Durable and reliable pipes that meet industry standards.
              {'\n'}
              <Text style={styles.boldText}>• Tools & Equipment:</Text> A diverse selection of tools, from basic hand tools to specialized equipment for professionals.
              {'\n'}
              <Text style={styles.boldText}>• Specialized Products:</Text> Unique and hard-to-find items that set your projects apart.
            </Text>
          </View>
        )}

        {/* Collapsible Section: Why Choose Us */}
        <TouchableOpacity onPress={() => toggleSection('choose')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="check-circle" size={24} />
            <Text style={styles.sectionHeader}>Why Choose Us?</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'choose' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              At <Text style={styles.boldText}>PowerTrack</Text>, we pride ourselves on our commitment to quality, customer service, and competitive pricing. Whether you're outfitting an entire project or simply need a few key items, we're here to help you succeed.
            </Text>
          </View>
        )}

        {/* Contact Button */}
        {/* <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => alert('Contact us to learn more!')} style={styles.contactButton}>
            Contact Us
          </Button>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    //backgroundColor: '#f0f4f7', // Light background color for the whole page
  },
  container: {
    flexGrow: 1,
    padding: 15, // Reduced padding for better spacing on mobile
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 12,   // Adds some spacing around the logo
  },

  logoImage: {
    width: responsiveWidth(70),   // Adjusts width to 50% of screen width
    height: responsiveWidth(50),  // Keeps height same as width for a perfect circle
    borderRadius: responsiveWidth(25), // Circular border proportional to width
   // borderWidth: 3, // Fixed border width
  //  borderColor: '#1E90FF', // Blue border to match theme
    resizeMode: 'contain', // Ensures the entire image content is visible
    marginBottom: responsiveHeight(2), // Dynamic margin-bottom relative to screen height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  header: {
    fontSize: width > 600 ? 36 : 24, // Larger font size for bigger screens
    fontWeight: 'bold',
    textAlign: 'center',
    //color: '#1E90FF',
    marginBottom: 20, // Extra spacing for a cleaner look
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#1E90FF',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  collapsibleContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    //backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: width > 600 ? 22 : 18, // Adjust font size for different devices
    fontWeight: 'bold',
    //color: '#1E90FF',
  },
  boldText: {
    fontWeight: 'bold',
    //color: '#1E90FF',
  },
  sectionText: {
    fontSize: 16, // Adjust font size for better readability on mobile
    //color: '#555',
    lineHeight: 24, // Proper line height for better text clarity
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 26,
  },
  contactButton: {
    //backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 10,
    width: '80%', // Button takes up most of the screen width
    elevation: 5,
  },
});



export default AboutUsPage;
