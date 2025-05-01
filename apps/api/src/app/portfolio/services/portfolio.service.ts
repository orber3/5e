import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { Portfolio } from '../schemas/portfolio.schema';
import { FmpApiService } from '../../stocks/services/fmp-api.service';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private portfolioRepository: PortfolioRepository,
    private fmpApiService: FmpApiService
  ) {}

  async getUserPortfolio(userId: string): Promise<Portfolio[]> {
    try {
      const objectId = new Types.ObjectId(userId);
      return this.portfolioRepository.findUserPortfolio(objectId);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error fetching user portfolio: ${errorMessage}`);
      throw new BadRequestException('Invalid user ID format');
    }
  }

  async addStockToPortfolio(
    userId: string,
    stockSymbol: string
  ): Promise<Portfolio> {
    try {
      // Validate the stock symbol exists by getting its quote
      await this.fmpApiService.getStockQuote(stockSymbol);

      const objectId = new Types.ObjectId(userId);

      // Check if stock already exists in portfolio
      const exists = await this.portfolioRepository.isStockInPortfolio(
        objectId,
        stockSymbol
      );

      if (exists) {
        throw new ConflictException('Stock is already in your portfolio');
      }

      return this.portfolioRepository.addStock(objectId, stockSymbol);
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (
        error instanceof Error &&
        error.message?.includes('No quote data found')
      ) {
        throw new NotFoundException(`Stock symbol ${stockSymbol} not found`);
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error adding stock to portfolio: ${errorMessage}`);
      throw new BadRequestException('Error adding stock to portfolio');
    }
  }

  async removeStockFromPortfolio(
    userId: string,
    stockSymbol: string
  ): Promise<void> {
    try {
      const objectId = new Types.ObjectId(userId);
      const removed = await this.portfolioRepository.removeStock(
        objectId,
        stockSymbol
      );

      if (!removed) {
        throw new NotFoundException(
          `Stock ${stockSymbol} not found in user's portfolio`
        );
      }
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error removing stock from portfolio: ${errorMessage}`);
      throw new BadRequestException('Error removing stock from portfolio');
    }
  }
}
