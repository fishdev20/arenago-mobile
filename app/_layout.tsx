import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import AuthProvider from '@/context/AuthContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  console.log('hello');

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="+not-found" /> */}
        {/* <Stack.Screen name="(tabs)/index" />
        <Stack.Screen name="(tabs)/explore" /> */}
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
