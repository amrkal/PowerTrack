import { GlobalStyles } from '@/constants/GlobalStyles';
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, PixelRatio, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const AboutUsPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View>
      <ScrollView contentContainerStyle={GlobalStyles.profileContainer}>
        {/* Logo Image Section */}
        <View>
          <Image 
            source={require('../../assets/logo.jpg')} 
            style={GlobalStyles.logoImage}
          />
        </View>

        {/* Collapsible Section: Welcome */}
        <TouchableOpacity onPress={() => toggleSection('welcome')}>
          <View style={GlobalStyles.collapsibleHeader}>
            <IconButton icon="store" size={24} />
            <Text style={GlobalStyles.sectionHeader}>
              ברוכים הבאים ל-<Text style={GlobalStyles.boldText}>חשמל הרמה</Text>
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'welcome' && (
          <View style={GlobalStyles.collapsibleContent}>
            <Text >
              ברוכים הבאים ל-<Text style={GlobalStyles.boldText}>חשמל הרמה</Text>, המקור האמין שלך לקווי נחושת איכותיים, צינורות חשמל וכלי עבודה מכל הסוגים. בין אם אתם עסק המחפש רכישות בכמות או אדם פרטי שמחפש את המחירים הטובים ביותר, אנחנו כאן בשבילכם.
            </Text>
          </View>
        )}

        {/* Collapsible Section: Our Mission */}
        <TouchableOpacity onPress={() => toggleSection('mission')}>
          <View style={GlobalStyles.collapsibleHeader}>
            <IconButton icon="flag" size={24} />
            <Text style={GlobalStyles.sectionHeader}>המשימה שלנו</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'mission' && (
          <View style={GlobalStyles.collapsibleContent}>
            <Text>
              המשימה שלנו היא לספק ללקוחותינו מוצרים איכותיים במחירים שאין להם תחרות. אנו פועלים מול לקוחות עסקיים ופרטיים, ומבטיחים שלכולם תהיה גישה לחומרים ולכלים הדרושים להם כדי להשלים את העבודה.
            </Text>
          </View>
        )}

        {/* Collapsible Section: What We Offer */}
        <TouchableOpacity onPress={() => toggleSection('offer')}>
          <View style={GlobalStyles.collapsibleHeader}>
            <IconButton icon="tools" size={24} />
            <Text style={GlobalStyles.sectionHeader}>מה אנחנו מציעים</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'offer' && (
          <View>
            <Text >
              <Text style={GlobalStyles.boldText}>• קווי נחושת:</Text> קווי נחושת איכותיים שמתאימים למגוון רחב של יישומים חשמליים.
              {'\n'}
              <Text style={GlobalStyles.boldText}>• צינורות חשמל:</Text> צינורות עמידים ואמינים שעומדים בסטנדרטים הגבוהים ביותר.
              {'\n'}
              <Text style={GlobalStyles.boldText}>• כלי עבודה וציוד:</Text> מבחר רחב של כלי עבודה, החל מכלים בסיסיים ועד לציוד מקצועי מיוחד.
              {'\n'}
              <Text style={GlobalStyles.boldText}>• מוצרים מיוחדים:</Text> פריטים ייחודיים וקשים להשגה שמבדילים את הפרויקטים שלכם.
            </Text>
          </View>
        )}

        {/* Collapsible Section: Why Choose Us */}
        <TouchableOpacity onPress={() => toggleSection('choose')}>
          <View style={GlobalStyles.collapsibleHeader}>
            <IconButton icon="check-circle" size={24} />
            <Text style={GlobalStyles.sectionHeader}>למה לבחור בנו?</Text>
          </View>
        </TouchableOpacity>
        {expandedSection === 'choose' && (
          <View style={GlobalStyles.collapsibleContent}>
            <Text>
              ב-<Text style={GlobalStyles.boldText}>חשמל הרמה</Text> אנחנו גאים במחויבות שלנו לאיכות, שירות לקוחות ומחירים תחרותיים. בין אם אתם מתכננים פרויקט שלם או זקוקים רק למספר פריטים, אנחנו כאן כדי לעזור לכם להצליח.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};




export default AboutUsPage;
