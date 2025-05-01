import httpService from './http.service';
import { NamesResponseDto } from '@y/libs';

/**
 * Example API service to demonstrate HTTP service usage
 */
export class ExampleApiService {
  private readonly basePath = '/examples';

  /**
   * Get all examples
   */
  public async getAll<T>(): Promise<T> {
    return httpService.get<T>(this.basePath);
  }

  /**
   * Get names from the API
   */
  public async getNames(): Promise<NamesResponseDto> {
    return httpService.get<NamesResponseDto>(`${this.basePath}/names`);
  }

  /**
   * Get example by ID
   */
  public async getById<T>(id: string | number): Promise<T> {
    return httpService.get<T>(`${this.basePath}/${id}`);
  }

  /**
   * Create a new example
   */
  public async create<T>(data: Partial<T>): Promise<T> {
    return httpService.post<T>(this.basePath, data);
  }

  /**
   * Update an example
   */
  public async update<T>(id: string | number, data: Partial<T>): Promise<T> {
    return httpService.put<T>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete an example
   */
  public async delete<T>(id: string | number): Promise<void> {
    return httpService.delete<void>(`${this.basePath}/${id}`);
  }
}

// Create a singleton instance
export const exampleApiService = new ExampleApiService();

// Export default for ease of use
export default exampleApiService;
