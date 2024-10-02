import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically navigate to ProductsPage
    router.push('/ProductsPage');
  }, [router]);

  return (
    <View>
      <Text>Redirecting to Products Page...</Text>
    </View>
  );
};

export default LandingPage;
