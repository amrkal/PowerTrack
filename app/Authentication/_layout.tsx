import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { router, Slot, Stack } from 'expo-router';
import { Title } from 'react-native-paper';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="LoginPage"
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordPage"
        options={{ title: '' }}
      />
      <Stack.Screen
        name="SignUpPage"
        options={{ title: '' }}
      />
      <Stack.Screen
        name="VerificationPage"
        options={{ title: ''}}
      />
    </Stack>
  );
}
