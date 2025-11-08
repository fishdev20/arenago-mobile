import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/ui/Button';
import { colors, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/libs/toast';
import { UserService } from '@/services/user';
import { User } from '@/types/user';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { ScrollView } from 'react-native-gesture-handler';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  country: z.string().trim().min(1, 'Select a country'),
  address: z.string().trim().min(5, 'Address is too short').optional(),
  phoneLocal: z
    .string()
    .trim()
    .min(4, 'Phone number is too short')
    .refine((v) => /^\d[\d\s-]*$/.test(v), 'Use digits only'),
});
// .superRefine((v, ctx) => {
//   const local = v.phoneLocal.replace(/\D/g, '');
//   const full = (v.country?.callingCode || '').replace('+', '') + local;
//   if (full.length < 8 || full.length > 15) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ['phoneLocal'],
//       message: 'Phone looks invalid',
//     });
//   }
// });

export default function SetupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [country, setCountry] = useState<Country | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const callingCode = country?.callingCode ?? '+';
  const phoneE164 = useMemo(() => {
    if (!country) return undefined;
    return `${country.callingCode}${phoneLocal.replace(/\D/g, '')}`;
  }, [country, phoneLocal]);

  const onPickCountry = (item: Country) => {
    console.log(item);
    setCountry(item);
    setErrors((e) => ({ ...e, country: '' }));
    setShowPicker(false);
  };

  const handleSubmit = async () => {
    if (!user) return;
    console.log(user);
    try {
      setLoading(true);
      setErrors({});
      const parsed = schema.safeParse({
        firstName,
        lastName,
        country: country?.name,
        address: address || undefined,
        phoneLocal,
      });
      console.log(parsed);

      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as string;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors as any);
        return;
      }

      // Build payload expected by the backend
      const payload: User = {
        id: user.id,
        email: user.email,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        country: parsed.data.country,
        address: parsed.data.address,
        phone: phoneE164, // E.164 like +358401234567
      };

      const userService = new UserService();
      await userService.setupUserInfo(user?.id, payload);
      toast.success('Profile updated');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Setup failed:', err);
      Alert.alert('Error', err?.message ?? 'Failed to save user information');
      toast.error(err?.message ?? 'Failed to save user information');
    } finally {
      setLoading(false);
    }
  };
  const flagUri = country?.cca2
    ? `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`
    : undefined;

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
              value={firstName}
              onChangeText={(v) => {
                setFirstName(v);
                if (errors.firstName)
                  setErrors((s) => ({ ...s, firstName: '' }));
              }}
              icon={
                <Icons.UserIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
              error={errors.firstName}
            />

            <Input
              placeholder="Last name"
              value={lastName}
              onChangeText={(v) => {
                setLastName(v);
                if (errors.lastName) setErrors((s) => ({ ...s, lastName: '' }));
              }}
              icon={
                <Icons.UserIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
              error={errors.lastName}
            />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              activeOpacity={0.8}
            >
              <Input
                pointerEvents="none"
                editable={false}
                value={country?.name.toString() || ''}
                icon={
                  flagUri ? (
                    <Image
                      source={{ uri: flagUri }}
                      style={{ width: 26, height: 18, borderRadius: 2 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Icons.FlagIcon size={20} color={colors.neutral300} />
                  )
                }
              />
            </TouchableOpacity>

            <Input
              placeholder="Address"
              value={address}
              onChangeText={(v) => {
                setAddress(v);
                if (errors.address) setErrors((s) => ({ ...s, address: '' }));
              }}
              icon={
                <Icons.MapPinIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
              error={errors.address}
            />

            {/* Phone with dynamic calling code prefix */}
            <Input
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phoneLocal}
              onChangeText={(v) => {
                setPhoneLocal(v.replace(/[^\d\s-]/g, ''));
                if (errors.phoneLocal)
                  setErrors((s) => ({ ...s, phoneLocal: '' }));
              }}
              icon={
                <Typo
                  size={16}
                  color={colors.neutral300}
                  style={{ width: 48, textAlign: 'center' }}
                >
                  +{callingCode}
                </Typo>
              }
              error={errors.phoneLocal}
            />

            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              <Typo fontWeight="600" size={22} color={colors.neutral900}>
                Continue
              </Typo>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountryPicker
        visible={showPicker}
        onSelect={onPickCountry}
        onClose={() => setShowPicker(false)}
        countryCode={country?.cca2 || 'FI'}
        withFlagButton={false}
        withFlag
        withFilter
      />
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
  helperText: {},
});
