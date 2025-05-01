import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResult } from '../dto/pagination.dto';
import { User } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get a paginated list of users
   */
  async getUsers(page = 1, limit = 10): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(page, limit);
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Get a user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Create a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with same email already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    return this.userRepository.create(createUserDto);
  }

  /**
   * Update a user
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.getUserById(id);

    // Check if email is unique if changing email
    if (updateUserDto.email) {
      const existingUserWithEmail = await this.userRepository.findByEmail(
        updateUserDto.email
      );
      // If there is a user with this email and it's not the same user we're updating
      if (existingUserWithEmail) {
        const existingUserId = await this.userRepository.findById(id);
        if (existingUserWithEmail !== existingUserId) {
          throw new ConflictException('Email already in use');
        }
      }
    }

    const updated = await this.userRepository.update(id, updateUserDto);
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updated;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    // Check if user exists
    await this.getUserById(id);

    return this.userRepository.delete(id);
  }

  /**
   * Count users
   */
  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }
}
