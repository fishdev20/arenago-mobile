import { Response } from '@/types/common';
import { User } from '@/types/user';
import { BaseApi } from './api';

export class UserService extends BaseApi {
  async getUserInfo(id: string): Promise<User> {
    const res = await this.get<Response<User>>(`/users/${id}`);
    if (!res.success) {
      throw new Error(res.message || 'Failed to get user');
    }
    return res.data;
  }

  async setupUserInfo(id: string, data: User): Promise<User> {
    const res = await this.post<Response<User>>(`/users/${id}`, data);
    if (!res.success) {
      throw new Error(res.message || 'Failed to setup user');
    }

    return res.data;
  }
}
