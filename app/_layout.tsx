import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0a' }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="add-review" />
        <Stack.Screen name="edit-review" />
      </Stack>
    </>
  );
}