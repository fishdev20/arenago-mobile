import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/ui/Button';
import { colors, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/libs/api';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function SetupScreen() {
  const router = useRouter();
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/users/setup', {
        name,
        phone,
      });
      await refreshMe();
      //   router.replace('/(tabs)');
    } catch (error) {
      console.error('Setup failed:', error);
      Alert.alert('Error', 'Failed to save user information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Typo size={24} fontWeight="600" style={styles.title}>
              Complete Your Profile
            </Typo>

            <Input
              placeholder="First name"
              keyboardType="email-address"
              onChangeText={(value) => console.log(value)}
              icon={
                <Icons.UserIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
            />
            <Input
              placeholder="Last name"
              // onChangeText={(value) => (passwordRef.current = value)}
              icon={
                <Icons.UserIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
            />
            <Input
              placeholder="Country"
              keyboardType="email-address"
              onChangeText={(value) => console.log(value)}
              icon={
                <Icons.FlagIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
            />
            <Input
              placeholder="Address"
              keyboardType="email-address"
              onChangeText={(value) => console.log(value)}
              icon={
                <Icons.MapPinIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
            />
            <Input
              placeholder="Phone number"
              keyboardType="email-address"
              onChangeText={(value) => console.log(value)}
              icon={
                <Icons.PhoneIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
            />

            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={!name || !phone}
              style={styles.button}
            >
              <Typo fontWeight={'600'} size={22} color={colors.neutral900}>
                Continue
              </Typo>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: spacingY._30,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacingY._10,
  },
  input: {
    backgroundColor: colors.neutral800,
    padding: 16,
    borderRadius: 8,
    marginBottom: spacingY._10,
    color: colors.text,
  },
  button: {
    marginTop: spacingY._10,
  },
});
