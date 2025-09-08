import Logo from '@/components/Logo';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import BackButton from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { setAuthToken } from '@/libs/api';
import { saveJWT } from '@/libs/session';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Login = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { loginWithGoogle, loading } = useAuth();

  const subRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      try {
        const { queryParams } = Linking.parse(url);
        const token = queryParams?.token as string | undefined;

        if (!token) {
          console.warn('No token received');
          return;
        }

        // First save the token
        await saveJWT(token);
        setAuthToken(token);
        // Force close the browser window
        try {
          await WebBrowser.dismissBrowser();
        } catch (e) {
          console.warn('Failed to dismiss browser:', e);
        }
        // Small delay to ensure browser is closed
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Navigate to main app
        // router.replace('/(tabs)');
      } catch (error) {
        console.error('Auth callback error:', error);
        Alert.alert('Error', 'Failed to complete authentication');
      }
    };

    // Set up the event listener
    const subscription = Linking.addEventListener('url', handleUrl);

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <ScreenWrapper>
      <ImageBackground
        source={require('../../assets/images/intro.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <BackButton
          iconSize={28}
          style={{ position: 'absolute', top: 5, left: 5 }}
        />
        <View style={styles.container}>
          <View></View>
          <View style={styles.footer}>
            <Logo />
            <Typo size={16} color={colors.textLighter}>
              Login now to track all your brands
            </Typo>

            <View style={styles.buttonContainer}>
              <Button
                style={styles.loginButton}
                onPress={loginWithGoogle}
                disabled={loading}
              >
                {loading ? (
                  <Loading />
                ) : (
                  <Image
                    source={require('../../assets/images/google.png')}
                    style={{ width: 20, height: 20, marginRight: 12 }}
                    resizeMode="contain"
                  />
                )}
                <Typo fontWeight="600" size={16} color="#000">
                  Continue with Google
                </Typo>
              </Button>
            </View>

            <Typo fontWeight={'400'} size={10} color={colors.textLighter}>
              By continuing you agree to Clair’s Terms and acknowledge our
              Privacy Policy.
            </Typo>
            <Typo fontWeight={'400'} size={10} color={colors.textLighter}>
              We only request access to email headers needed to find your
              memberships.
            </Typo>
          </View>
        </View>
      </ImageBackground>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    transform: [{ translateY: -200 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    transform: [{ translateY: -200 }],
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacingY._7,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 16,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    shadowRadius: 30,
    shadowOpacity: 0.5,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: spacingX._25,
    marginTop: spacingY._5,
    marginBottom: spacingY._5,
  },
  loginButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
