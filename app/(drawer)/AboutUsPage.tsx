import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, PixelRatio, ScrollView, Image, TouchableOpacity } from 'react-native';
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

        {/* Collapsible Section: Welcome */}
        <TouchableOpacity onPress={() => toggleSection('welcome')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="store" size={24} />
            <Text style={styles.sectionHeader}>
              ברוכים הבאים ל-<Text style={styles.boldText}>חשמל הרמה</Text>
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'welcome' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              ברוכים הבאים ל-<Text style={styles.boldText}>חשמל הרמה</Text>, המקור האמין שלך לקווי נחושת איכותיים, צינורות חשמל וכלי עבודה מכל הסוגים. בין אם אתם עסק המחפש רכישות בכמות או אדם פרטי שמחפש את המחירים הטובים ביותר, אנחנו כאן בשבילכם.
            </Text>
          </View>
        )}

        {/* Collapsible Section: Our Mission */}
        <TouchableOpacity onPress={() => toggleSection('mission')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="flag" size={24} />
            <Text style={styles.sectionHeader}>המשימה שלנו</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'mission' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              המשימה שלנו היא לספק ללקוחותינו מוצרים איכותיים במחירים שאין להם תחרות. אנו פועלים מול לקוחות עסקיים ופרטיים, ומבטיחים שלכולם תהיה גישה לחומרים ולכלים הדרושים להם כדי להשלים את העבודה.
            </Text>
          </View>
        )}

        {/* Collapsible Section: What We Offer */}
        <TouchableOpacity onPress={() => toggleSection('offer')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="tools" size={24} />
            <Text style={styles.sectionHeader}>מה אנחנו מציעים</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'offer' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>• קווי נחושת:</Text> קווי נחושת איכותיים שמתאימים למגוון רחב של יישומים חשמליים.
              {'\n'}
              <Text style={styles.boldText}>• צינורות חשמל:</Text> צינורות עמידים ואמינים שעומדים בסטנדרטים הגבוהים ביותר.
              {'\n'}
              <Text style={styles.boldText}>• כלי עבודה וציוד:</Text> מבחר רחב של כלי עבודה, החל מכלים בסיסיים ועד לציוד מקצועי מיוחד.
              {'\n'}
              <Text style={styles.boldText}>• מוצרים מיוחדים:</Text> פריטים ייחודיים וקשים להשגה שמבדילים את הפרויקטים שלכם.
            </Text>
          </View>
        )}

        {/* Collapsible Section: Why Choose Us */}
        <TouchableOpacity onPress={() => toggleSection('choose')}>
          <View style={styles.collapsibleHeader}>
            <IconButton icon="check-circle" size={24} />
            <Text style={styles.sectionHeader}>למה לבחור בנו?</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'choose' && (
          <View style={styles.collapsibleContent}>
            <Text style={styles.sectionText}>
              ב-<Text style={styles.boldText}>חשמל הרמה</Text> אנחנו גאים במחויבות שלנו לאיכות, שירות לקוחות ומחירים תחרותיים. בין אם אתם מתכננים פרויקט שלם או זקוקים רק למספר פריטים, אנחנו כאן כדי לעזור לכם להצליח.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    padding: 15,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  logoImage: {
    width: responsiveWidth(70),
    height: responsiveWidth(50),
    borderRadius: responsiveWidth(25),
    resizeMode: 'contain',
    marginBottom: responsiveHeight(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: width > 600 ? 22 : 18,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AboutUsPage;
