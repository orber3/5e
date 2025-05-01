import { PaginatedResult } from '../../dto/pagination.dto';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';


export interface IUserRepository {
  findAll(page?: number, limit?: number): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserDto): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
