import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://localhost:4000';

export interface User {
  id: string;
  email: string;
}

export const authService = {
  client: axios.create({
    baseURL: API_URL,
    withCredentials: true,
  }),

  async saveToken(token: string) {
    await SecureStore.setItemAsync('token', token);
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  async getUser(): Promise<User | null> {
    try {
      const { data } = await this.client.get('/auth/me');
      return data.user;
    } catch {
      return null;
    }
  },

  async logout() {
    await this.client.post('/auth/logout');
    await SecureStore.deleteItemAsync('token');
    delete this.client.defaults.headers.common.Authorization;
  },
};
