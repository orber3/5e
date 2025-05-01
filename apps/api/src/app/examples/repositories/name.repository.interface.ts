import { PaginatedResult } from '../../dto/pagination.dto';
import { Name } from '../schemas/name.schema';

export interface INameRepository {
  /**
   * Find all names with pagination
   */
  findAll(page?: number, limit?: number): Promise<PaginatedResult<Name>>;

  /**
   * Find a name by ID
   */
  findById(id: string): Promise<Name | null>;

  /**
   * Create a new name
   */
  create(name: string): Promise<Name>;

  /**
   * Update a name
   */
  update(id: string, name: string): Promise<Name | null>;

  /**
   * Delete a name
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count total names
   */
  count(): Promise<number>;

  /**
   * Get names without pagination (for backward compatibility)
   */
  getAllNames(): Promise<string[]>;
}
