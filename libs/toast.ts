import { ApiError } from '@/services/api';
import type { AxiosError } from 'axios';
import { Toast } from 'toastify-react-native';

const lastShown = new Map<string, number>();
const DEDUPE_MS = 1200;

const shouldSkip = (key: string) => {
  const now = Date.now();
  const last = lastShown.get(key) ?? 0;
  if (now - last < DEDUPE_MS) return true;
  lastShown.set(key, now);
  return false;
};

export const toast = {
  success(msg: string) {
    if (shouldSkip(`s:${msg}`)) return;
    Toast.success(msg);
  },
  info(msg: string) {
    if (shouldSkip(`i:${msg}`)) return;
    Toast.info(msg);
  },
  warn(msg: string) {
    if (shouldSkip(`w:${msg}`)) return;
    Toast.warn(msg);
  },
  error(msg: string) {
    if (shouldSkip(`e:${msg}`)) return;
    Toast.error(msg);
  },

  /** Smart error handler: ApiError → AxiosError → generic */
  fromError(err: unknown, fallback = 'Something went wrong') {
    if (err instanceof ApiError) {
      return Toast.error(err.message);
    }
    const ax = err as AxiosError<any>;
    const msg =
      ax?.response?.data?.message ||
      ax?.message ||
      (typeof err === 'object' && err && 'message' in err
        ? (err as any).message
        : undefined) ||
      fallback;
    Toast.error(String(msg));
  },
};
