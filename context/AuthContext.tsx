import { api, API_BASE, setAuthToken } from '@/libs/api';
import { decodeJWT } from '@/libs/jwt';
import { clearJWT, loadJWT, saveJWT } from '@/libs/session';
import { User } from '@/services/auth';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

type AuthState = {
  user?: User;
  loading: boolean;
};
type AuthCtx = AuthState & {
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
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

  useEffect(() => {
    (async () => {
      const token = await loadJWT();
      console.log('token from storage', token);
      if (token) {
        setAuthToken(token);
        const decoded = decodeJWT(token);
        const userId = decoded.sub;
        const userInfo = await getUserInfo(userId);
        console.log(userInfo, 'user info');
        const isSetup = !!(
          userInfo.firstName &&
          userInfo.lastName &&
          userInfo.country
        );
        if (!isSetup) {
          router.replace('/(setup)');
          return;
        }
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
      setLoading(false);
    })();
  }, [router]);

  async function loginWithGoogle() {
    const redirect =
      Platform.OS !== 'web'
        ? AuthSession.makeRedirectUri({
            path: 'auth-callback',
            scheme: 'clair',
            preferLocalhost: false,
          })
        : `${window.location.origin}/auth-callback`; // must match exactly
    try {
      setLoading(true);
      const authUrl = `${API_BASE}/auth/google?redirect=${encodeURIComponent(redirect)}`;
      if (Platform.OS === 'web') {
        window.location.href = authUrl;
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
            const userInfo = await getUserInfo(userId);
            const isSetup = !!(
              userInfo.firstName &&
              userInfo.lastName &&
              userInfo.country
            );

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
      Alert.alert('Login failed', e?.message ?? 'Something went wrong');
    }
  }

  async function refreshMe() {
    console.log(`${API_BASE}/auth/me`);
    const me = await api.get(`${API_BASE}/user/me`).then((r) => r.data);
    console.log(me);
    setUser(me.user);
  }

  async function getUserInfo(id: string) {
    const res = await api.get(`${API_BASE}/user/${id}`).then((r) => r.data);
    const userInfo = res.data;
    setUser(userInfo);
    return userInfo;
  }

  async function logout() {
    await clearJWT();
    setAuthToken(undefined);
    setUser(null);
  }
  // logout();

  return (
    <Ctx.Provider value={{ user, loading, loginWithGoogle, logout, refreshMe }}>
      {children}
    </Ctx.Provider>
  );
}
