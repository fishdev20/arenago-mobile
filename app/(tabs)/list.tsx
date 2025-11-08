import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const Home = () => {
  const router = useRouter();

  //   console.log(router);

  return (
    <ScreenWrapper>
      <View>
        {/* Header */}
        <Text>Test</Text>
      </View>
    </ScreenWrapper>
  );
};

export default Home;
