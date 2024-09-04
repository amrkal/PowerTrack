import React from 'react';
import { Stack } from 'expo-router';

export default function CheckDeliveryLayout() {
  return (
    <Stack>
      <Stack.Screen name="CheckOutPage" />
      <Stack.Screen name="DeliveryPage" />
      {/* Add other CheckDelivery screens as needed */}
    </Stack>
  );
}
