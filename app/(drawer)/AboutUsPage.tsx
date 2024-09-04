import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { GlobalStyles } from '../../constants/GlobalStyles';

const AboutUsPage: React.FC = () => {
  return (
    <View style={GlobalStyles.container}>
      <Image
        source={require('../../assets/images/favicon.png')} // Replace with your store's image
        style={styles.headerImage}
      />
      <Text style={styles.header}>About Us</Text>
      <Text style={styles.introText}>
        Welcome to [Your Store Name], your trusted source for high-quality copper lines, electric pipes, and all types of tools. Whether you’re a business looking for bulk purchases or an individual seeking the best prices, we’ve got you covered.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Our Mission</Text>
        <Text style={styles.sectionText}>
          Our mission is to provide our customers with top-notch products at unbeatable prices. We cater to both B2B and B2C clients, ensuring that everyone has access to the materials and tools they need to get the job done.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>What We Offer</Text>
        <Text style={styles.sectionText}>
          - **Copper Lines**: Premium quality copper lines suitable for a wide range of electrical applications.
          - **Electric Pipes**: Durable and reliable pipes that meet industry standards.
          - **Tools & Equipment**: A diverse selection of tools, from basic hand tools to specialized equipment for professionals.
          - **Specialized Products**: Unique and hard-to-find items that set your projects apart.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Why Choose Us?</Text>
        <Text style={styles.sectionText}>
          At [Your Store Name], we pride ourselves on our commitment to quality, customer service, and competitive pricing. Whether you’re outfitting an entire project or simply need a few key items, we’re here to help you succeed.
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={() => alert('Contact us to learn more!')}
        style={styles.contactButton}
      >
        Contact Us
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  contactButton: {
    marginTop: 30,
    paddingVertical: 10,
    marginHorizontal: 20,
  },
});

export default AboutUsPage;
