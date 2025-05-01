import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResult } from '../../dto/pagination.dto';
import { Name, NameDocument } from '../schemas/name.schema';
import { INameRepository } from './name.repository.interface';

@Injectable()
export class NameRepository implements INameRepository {
  constructor(@InjectModel(Name.name) private nameModel: Model<NameDocument>) {}

  async findAll(page = 1, limit = 10): Promise<PaginatedResult<Name>> {
    const skip = (page - 1) * limit;
    const [items, totalItems] = await Promise.all([
      this.nameModel.find().skip(skip).limit(limit).exec(),
      this.nameModel.countDocuments(),
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

  async findById(id: string): Promise<Name | null> {
    return this.nameModel.findById(id).exec();
  }

  async create(name: string): Promise<Name> {
    const newName = new this.nameModel({ name });
    return newName.save();
  }

  async update(id: string, name: string): Promise<Name | null> {
    return this.nameModel.findByIdAndUpdate(id, { name }, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.nameModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async count(): Promise<number> {
    return this.nameModel.countDocuments().exec();
  }

  async getAllNames(): Promise<string[]> {
    const names = await this.nameModel.find().select('name').exec();
    return names.map((name) => name.name);
  }
}
