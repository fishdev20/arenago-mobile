import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();
  const { token, refresh } = useLocalSearchParams<{
    token?: string;
    refresh?: string;
  }>();

  useEffect(() => {
    (async () => {
      if (token) {
        // await saveJWT(token);
        // setAuthToken(token);
        // if you also return ?refresh=..., store it too
        // await saveRefresh(refresh);
        await WebBrowser.dismissBrowser(); // safe to call
        router.replace('/'); // or '/home' (real route, not '/(tabs)')
      } else {
        router.replace('/login');
      }
    })();
  }, [token, refresh]);

  return null; // nothing to render
}
