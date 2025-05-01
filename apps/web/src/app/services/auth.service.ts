import httpService from './http.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string; 
  user: User;
}

export class AuthService {
  private AUTH_BASE_PATH = '/auth';

  /**
   * Login user - sets authentication cookie
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return httpService.post<AuthResponse>(
      `${this.AUTH_BASE_PATH}/login`,
      credentials
    );
  }

  /**
   * Register user - sets authentication cookie
   */
  public async register(
    credentials: RegisterCredentials
  ): Promise<AuthResponse> {
    return httpService.post<AuthResponse>(
      `${this.AUTH_BASE_PATH}/register`,
      credentials
    );
  }

  /**
   * Logout user - clears authentication cookie
   */
  public async logout(): Promise<void> {
    return httpService.post<void>(`${this.AUTH_BASE_PATH}/logout`, {});
  }
}

export const authService = new AuthService();
export default authService;
