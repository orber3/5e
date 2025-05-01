import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { environment } from '../environment';

/**
 * HTTP Service for API calls with cookie support
 */
export class HttpService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = environment.apiUrl;

    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // This is crucial for cookie-based auth
      withCredentials: true,
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle errors globally
        // For example, redirect to login if 401 unauthorized
        if (error.response?.status === 401) {
          // Handle unauthorized error - will be handled by auth hook
          console.error('Unauthorized request');
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  // Generic POST method
  public async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  // Generic PUT method
  public async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  // Generic PATCH method
  public async patch<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return response.data;
  }

  // Generic DELETE method
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }
}

// Create a singleton instance
export const httpService = new HttpService();

// Export default for ease of use
export default httpService;
