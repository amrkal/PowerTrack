import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import axiosInstance from '../../services/axiosInstance';

const PrivacyPolicyPage: React.FC = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axiosInstance.get('/privacy-policy');
        setPrivacyPolicy(response.data.policy || 'No policy available at the moment.');
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setPrivacyPolicy('Failed to load privacy policy.');
      }
    };
    fetchPrivacyPolicy();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.content}>{privacyPolicy}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default PrivacyPolicyPage;
