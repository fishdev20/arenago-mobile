import Logo from '@/components/Logo';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

const index = () => {
  const router = useRouter();
  // useEffect(() => {
  //   setTimeout(() => {
  //     const token = loadJWT();
  //     if (!token) {
  //       router.push('/(auth)/welcome');
  //     } else {
  //       router.push('/(tabs)/index');
  //     }
  //   }, 2000);
  // }, []);

  return (
    <View style={styles.container}>
      {/* <Image
        style={styles.logo}
        resizeMode="contain"
        source={require('../assets/images/splash.png')}
      /> */}
      <Logo />
    </View>
  );
};
export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: '100%',
    aspectRatio: 1,
  },
});
