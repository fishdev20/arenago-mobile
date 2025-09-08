import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SetupLayout = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default SetupLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
