import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/ui/Button';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/libs/toast';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Home = () => {
  const router = useRouter();

  //   console.log(router);
  const { logout } = useAuth();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <Text>Test</Text>
        <Button onPress={logout}>
          <Typo>Log out</Typo>
        </Button>
        <Button onPress={() => toast.success('Test toast')}>
          <Typo>Show toast</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 10,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: 'absolute',
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
