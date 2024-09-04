import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { router, Slot, Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="LoginPage"
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="ForgotPasswordPage"
        options={{ title: 'Forgot Password' }}
      />
      <Stack.Screen
        name="SignUpPage"
        options={{ title: 'SignUp' }}
      />
      <Stack.Screen
        name="VerificationPage"
        options={{ title: 'Verification' }}
      />
    </Stack>
  );
}
