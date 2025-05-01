import httpService from './http.service';
import { User } from './auth.service';

export class UserService {
  private USER_BASE_PATH = '/users';

  /**
   * Get the currently authenticated user (checks auth status)
   * @returns The current user or null if not authenticated
   */
  public async getCurrentUser(): Promise<User | null> {
    try {
      // This endpoint would need to be implemented on the backend
      // It should check the JWT token from cookies and return user data
      return await httpService.get<User>(`${this.USER_BASE_PATH}/me`);
    } catch (error) {
      return null;
    }
  }
}

export const userService = new UserService();
export default userService;
