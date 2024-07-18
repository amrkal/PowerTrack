import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="Register" />
      <Stack.Screen name="main" />
    </Stack>
  );
}
