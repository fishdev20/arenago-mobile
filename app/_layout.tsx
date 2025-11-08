import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import ToastHost from '@/components/ui/ToastHost';
import AuthProvider from '@/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastHost />
        <Stack screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="+not-found" /> */}
          {/* <Stack.Screen name="(tabs)/index" />
        <Stack.Screen name="(tabs)/explore" /> */}
        </Stack>
        <StatusBar style="auto" />
        <ToastHost />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
