import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '../dto/pagination.dto';
import { Name } from './schemas/name.schema';
import { NameRepository } from './repositories/name.repository';

@Injectable()
export class ExamplesService {
  constructor(private readonly nameRepository: NameRepository) {}

  /**
   * Get a list of example names
   * @returns Array of name strings
   */
  getNames(): Promise<string[]> {
    return this.nameRepository.getAllNames();
  }

  /**
   * Get paginated list of names
   */
  async getPaginatedNames(
    page = 1,
    limit = 10
  ): Promise<PaginatedResult<Name>> {
    return this.nameRepository.findAll(page, limit);
  }

  /**
   * Get a name by ID
   */
  async getNameById(id: string): Promise<Name | null> {
    return this.nameRepository.findById(id);
  }

  /**
   * Create a new name
   */
  async createName(name: string): Promise<Name> {
    return this.nameRepository.create(name);
  }

  /**
   * Update a name
   */
  async updateName(id: string, name: string): Promise<Name | null> {
    return this.nameRepository.update(id, name);
  }

  /**
   * Delete a name
   */
  async deleteName(id: string): Promise<boolean> {
    return this.nameRepository.delete(id);
  }
}
