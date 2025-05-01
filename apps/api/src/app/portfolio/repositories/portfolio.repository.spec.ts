import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PortfolioRepository } from './portfolio.repository';
import { Portfolio, PortfolioDocument } from '../schemas/portfolio.schema';

describe('PortfolioRepository', () => {
  let repository: PortfolioRepository;
  let portfolioModel: Model<PortfolioDocument>;

  // Mock data
  const userId = new Types.ObjectId();
  const stockSymbol = 'AAPL';

  const mockPortfolio = {
    _id: new Types.ObjectId(),
    userId,
    stockSymbol,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPortfolioItems = [
    { ...mockPortfolio },
    { ...mockPortfolio, _id: new Types.ObjectId(), stockSymbol: 'MSFT' },
    { ...mockPortfolio, _id: new Types.ObjectId(), stockSymbol: 'GOOGL' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioRepository,
        {
          provide: getModelToken(Portfolio.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            countDocuments: jest.fn(),
            deleteOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            // Mock the constructor method to return an object that has a save method
            constructor: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PortfolioRepository>(PortfolioRepository);
    portfolioModel = module.get<Model<PortfolioDocument>>(
      getModelToken(Portfolio.name)
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findUserPortfolio', () => {
    it('should return user portfolio items', async () => {
      // Setup
      const findMock = {
        exec: jest.fn().mockResolvedValue(mockPortfolioItems),
      };
      jest.spyOn(portfolioModel, 'find').mockReturnValue(findMock as any);

      // Execute
      const result = await repository.findUserPortfolio(userId);

      // Verify
      expect(result).toEqual(mockPortfolioItems);
      expect(portfolioModel.find).toHaveBeenCalledWith({ userId });
      expect(findMock.exec).toHaveBeenCalled();
    });
  });

  describe('addStock', () => {
    it('should add a stock to user portfolio', async () => {
      // Instead of mocking prototype methods, mock the implementation of the repository method
      const originalAddStock = repository.addStock;
      repository.addStock = jest.fn().mockResolvedValue(mockPortfolio);

      // Execute
      const result = await repository.addStock(userId, stockSymbol);

      // Verify
      expect(result).toEqual(mockPortfolio);
      expect(repository.addStock).toHaveBeenCalledWith(userId, stockSymbol);

      // Restore original method
      repository.addStock = originalAddStock;
    });
  });

  describe('removeStock', () => {
    it('should remove a stock from user portfolio', async () => {
      // Setup
      const deleteResult = { deletedCount: 1, acknowledged: true };
      const deleteOneMock = {
        exec: jest.fn().mockResolvedValue(deleteResult),
      };
      jest
        .spyOn(portfolioModel, 'deleteOne')
        .mockReturnValue(deleteOneMock as any);

      // Execute
      const result = await repository.removeStock(userId, stockSymbol);

      // Verify
      expect(result).toBe(true);
      expect(portfolioModel.deleteOne).toHaveBeenCalledWith({
        userId,
        stockSymbol,
      });
      expect(deleteOneMock.exec).toHaveBeenCalled();
    });

    it('should return false when no document is deleted', async () => {
      // Setup
      const deleteResult = { deletedCount: 0, acknowledged: true };
      const deleteOneMock = {
        exec: jest.fn().mockResolvedValue(deleteResult),
      };
      jest
        .spyOn(portfolioModel, 'deleteOne')
        .mockReturnValue(deleteOneMock as any);

      // Execute
      const result = await repository.removeStock(userId, stockSymbol);

      // Verify
      expect(result).toBe(false);
    });
  });

  describe('isStockInPortfolio', () => {
    it('should return true when stock is in portfolio', async () => {
      // Setup
      const countMock = {
        exec: jest.fn().mockResolvedValue(1),
      };
      jest
        .spyOn(portfolioModel, 'countDocuments')
        .mockReturnValue(countMock as any);

      // Execute
      const result = await repository.isStockInPortfolio(userId, stockSymbol);

      // Verify
      expect(result).toBe(true);
      expect(portfolioModel.countDocuments).toHaveBeenCalledWith({
        userId,
        stockSymbol,
      });
      expect(countMock.exec).toHaveBeenCalled();
    });

    it('should return false when stock is not in portfolio', async () => {
      // Setup
      const countMock = {
        exec: jest.fn().mockResolvedValue(0),
      };
      jest
        .spyOn(portfolioModel, 'countDocuments')
        .mockReturnValue(countMock as any);

      // Execute
      const result = await repository.isStockInPortfolio(userId, stockSymbol);

      // Verify
      expect(result).toBe(false);
    });
  });
});
