import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResult } from '../../dto/pagination.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { IUserRepository } from './user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(page = 1, limit = 10): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * limit;
    const [items, totalItems] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      totalItems,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
