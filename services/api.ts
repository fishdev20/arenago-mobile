import { loadJWT } from '@/libs/session';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

type QueryParams = Record<string, string | number | boolean | undefined>;

// For device testing, use your computer’s LAN IP
export const API_BASE = __DEV__
  ? ' https://accessory-korean-netscape-viewer.trycloudflare.com'
  : 'https://your-domain.com';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class BaseApi {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(async (config) => {
      const token = await loadJWT();
      if (token) {
        console.log('Token is loaded');
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization =
          `Bearer ${token}`;
      } else if (config.headers) {
        delete (config.headers as Record<string, string>).Authorization;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const { status, data } = error.response;
          throw new ApiError(
            status,
            (data as any)?.code || 'UNKNOWN_ERROR',
            (data as any)?.message || 'Something went wrong',
          );
        }
        throw error;
      },
    );
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request<T>(config);
    return response.data;
  }

  protected async get<T>(
    path: string,
    params?: QueryParams,
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'params'>,
  ): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url: path,
      params,
      ...config,
    });
  }

  protected async post<T>(
    path: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>,
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url: path,
      data,
      ...config,
    });
  }

  protected async put<T>(
    path: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>,
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url: path,
      data,
      ...config,
    });
  }

  protected async patch<T>(
    path: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>,
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url: path,
      data,
      ...config,
    });
  }

  protected async delete<T>(
    path: string,
    params?: QueryParams,
    config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'params'>,
  ): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url: path,
      params,
      ...config,
    });
  }
}
