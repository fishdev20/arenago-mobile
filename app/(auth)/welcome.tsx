import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const Welcome = () => {
  const router = useRouter();
  const animation = useRef<LottieView>(null);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.welcomeImage}
            source={require('../../assets/onboard.json')}
          />
        </View>
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: 'center' }}
          >
            <Typo size={30} fontWeight={'800'}>
              All your brands
            </Typo>
            <Typo size={30} fontWeight={'800'}>
              in one place
            </Typo>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
            style={{ alignItems: 'center', gap: 2 }}
          >
            <Typo size={17} color={colors.textLight}>
              Manage your brands, stores, and websites
            </Typo>
            <Typo size={17} color={colors.textLight}>
              -no clutter, just what matters.
            </Typo>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
            style={styles.buttonContainer}
          >
            <Button onPress={() => router.push('/(auth)/login')}>
              <Typo fontWeight={'600'} size={22} color={colors.neutral900}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: '100%',
    height: verticalScale(300),
    alignSelf: 'center',
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: 'flex-end',
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: 'center',
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(35),
    gap: spacingY._20,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: spacingX._25,
  },
});
