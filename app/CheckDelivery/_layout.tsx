import React from 'react';
import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';

export default function CheckDeliveryLayout() {
  return (
    <Stack>
      <Stack.Screen name="DeliveryPage" />
      {/* Add other CheckDelivery screens as needed */}
    </Stack>
  );
}
