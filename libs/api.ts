import { BaseApi } from '@/services/api';
import { clearJWT, loadJWT, saveJWT } from './session';

// export const api = axios.create({
//   baseURL: API_BASE,
// });

// helper to set/remove auth header globally
// export function setAuthToken(token?: string) {
//   if (token) {
//     api.defaults.headers.common.Authorization = `Bearer ${token}`;
//     console.log(api.defaults.headers.common.Authorization);
//   } else delete api.defaults.headers.common.Authorization;
// }

export const api = new BaseApi();

/**
 * Init on app start (as before)
 */
export async function initApi() {
  const token = await loadJWT();
  setAuthToken(token);
}

/**
 * Call this right after login to set the new token.
 */
export function setAuthToken(token?: string | null) {
  if (token) {
    api['api'].defaults.headers.common.Authorization = `Bearer ${token}`;
    saveJWT(token);
  } else {
    delete api['api'].defaults.headers.common.Authorization;
    clearJWT();
  }
}
