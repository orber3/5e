import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Portfolio, PortfolioDocument } from '../schemas/portfolio.schema';

@Injectable()
export class PortfolioRepository {
  private readonly logger = new Logger(PortfolioRepository.name);

  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>
  ) {}

  async findUserPortfolio(userId: Types.ObjectId): Promise<Portfolio[]> {
    this.logger.debug(`Finding portfolio for user ${userId}`);
    return this.portfolioModel.find({ userId }).exec();
  }

  async addStock(
    userId: Types.ObjectId,
    stockSymbol: string
  ): Promise<Portfolio> {
    this.logger.debug(
      `Adding stock ${stockSymbol} to portfolio of user ${userId}`
    );
    const newPortfolioItem = new this.portfolioModel({
      userId,
      stockSymbol,
    });
    return newPortfolioItem.save();
  }

  async removeStock(
    userId: Types.ObjectId,
    stockSymbol: string
  ): Promise<boolean> {
    this.logger.debug(
      `Removing stock ${stockSymbol} from portfolio of user ${userId}`
    );
    const result = await this.portfolioModel
      .deleteOne({
        userId,
        stockSymbol,
      })
      .exec();

    return result.deletedCount > 0;
  }

  async isStockInPortfolio(
    userId: Types.ObjectId,
    stockSymbol: string
  ): Promise<boolean> {
    const count = await this.portfolioModel
      .countDocuments({
        userId,
        stockSymbol,
      })
      .exec();

    return count > 0;
  }
}
