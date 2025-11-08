import { setAuthToken } from '@/libs/api';
import { decodeJWT } from '@/libs/jwt';
import { clearJWT, loadJWT, saveJWT } from '@/libs/session';
import { toast } from '@/libs/toast';
import { API_BASE } from '@/services/api';
import { UserService } from '@/services/user';
import { User } from '@/types/user';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

type AuthState = {
  user?: User;
  loading: boolean;
};
type AuthCtx = AuthState & {
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};
const Ctx = createContext<AuthCtx>(null as any);
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthState['user']>(undefined);
  const [loading, setLoading] = useState<AuthState['loading']>(true);

  const router = useRouter();
  const userService = new UserService();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await loadJWT();
        if (!mounted) return;

        if (token) {
          setAuthToken(token);
          let decoded: { sub?: string } | undefined;
          try {
            decoded = decodeJWT(token);
          } catch {
            // Bad token -> clear and go to auth
            await clearJWT();
            setAuthToken(undefined);
            if (mounted) router.replace('/(auth)/welcome');
            return;
          }

          const userId = decoded?.sub;
          if (!userId) {
            await clearJWT();
            setAuthToken(undefined);
            if (mounted) router.replace('/(auth)/welcome');
            return;
          }

          const info = await userService.getUserInfo(userId);
          if (!mounted) return;

          setUser(info);
          console.log(info);

          if (!isUserSetup(info)) {
            router.replace('/(setup)');
          } else {
            router.replace('/(tabs)');
          }
        } else {
          router.replace('/(auth)/welcome');
        }
      } catch (e) {
        // Optional: log or show a soft error
        console.warn('Auth bootstrap failed:', e);
        router.replace('/(auth)/welcome');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loginWithGoogle() {
    const redirect =
      Platform.OS !== 'web'
        ? AuthSession.makeRedirectUri({
            path: 'auth-callback',
            scheme: 'clair',
            preferLocalhost: false,
          })
        : `${window.location.origin}/auth-callback`;
    try {
      setLoading(true);
      const authUrl = `${API_BASE}/auth/google?redirect=${encodeURIComponent(redirect)}`;
      if (Platform.OS === 'web') {
        window.location.href = authUrl;
        return;
        // router.replace('/(tabs)');
      } else {
        const result = await WebBrowser.openAuthSessionAsync(
          authUrl,
          redirect,
          {
            showInRecents: true,
            preferEphemeralSession: true,
            dismissButtonStyle: 'close',
          },
        );
        if (result.type === 'success' && result.url) {
          const { queryParams } = Linking.parse(result.url);
          const token = queryParams?.token as string | undefined;
          if (token) {
            await saveJWT(token);
            setAuthToken(token);
            const decoded = decodeJWT(token);
            const userId = decoded.sub;

            const userInfo = await userService.getUserInfo(userId);
            const isSetup = isUserSetup(userInfo);
            if (!isSetup) {
              router.replace('/(setup)');
              return;
            }
            router.replace('/(tabs)');
            return;
          }
        }
        if (result.type === 'cancel' || result.type === 'dismiss')
          setLoading(false);
      }
    } catch (e: any) {
      setLoading(false);
      toast.error('Login failed, please try again');
      router.replace('/(auth)/welcome');
    } finally {
      setLoading(false);
    }
  }

  function isUserSetup(user: User) {
    return !!(user.firstName && user.lastName && user.country);
  }
  async function logout() {
    await clearJWT();
    setAuthToken(undefined);
    setUser(undefined);
    router.replace('/(auth)/welcome');
  }
  // logout();

  const value = useMemo(
    () => ({ user, loading, loginWithGoogle, logout }),
    [user, loading],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
