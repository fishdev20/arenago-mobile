import axios from 'axios';

// For device testing, use your computer’s LAN IP
export const API_BASE = __DEV__
  ? 'https://split-neither-precisely-casey.trycloudflare.com'
  : 'https://your-domain.com';

export const api = axios.create({
  baseURL: API_BASE,
});

// helper to set/remove auth header globally
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log(api.defaults.headers.common.Authorization);
  } else delete api.defaults.headers.common.Authorization;
}
