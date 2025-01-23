import React from 'react';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Color } from '@/constants/Colors';

const ProfileLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back"
              size={30}
              color={Color.Blue}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        ),
        headerShown: true,
      })}
    >
      <Stack.Screen
        name="OrderHistoryPage"
        options={{ title: 'היסטוריית הזמנות' }}
      />
      <Stack.Screen
        name="ReturnsPage"
        options={{ title: 'החזרות' }}
      />
      <Stack.Screen
        name="PrivacyPolicyPage"
        options={{ title: 'מדיניות פרטיות' }}
      />
      <Stack.Screen
        name="PrivacySettingsPage"
        options={{ title: 'הגדרות פרטיות' }}
      />
    </Stack>
  );
};

export default ProfileLayout;
