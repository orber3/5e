import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PortfolioService } from './portfolio.service';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { FmpApiService } from '../../stocks/services/fmp-api.service';
import { Portfolio } from '../schemas/portfolio.schema';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let portfolioRepository: PortfolioRepository;
  let fmpApiService: FmpApiService;

  // Mock data
  const userId = new Types.ObjectId().toString();
  const stockSymbol = 'AAPL';

  const mockPortfolioItem = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(userId),
    stockSymbol,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Portfolio;

  const mockPortfolioItems = [
    mockPortfolioItem,
    {
      ...mockPortfolioItem,
      _id: new Types.ObjectId(),
      stockSymbol: 'MSFT',
    } as unknown as Portfolio,
    {
      ...mockPortfolioItem,
      _id: new Types.ObjectId(),
      stockSymbol: 'GOOGL',
    } as unknown as Portfolio,
  ];

  const mockStockQuote = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.25,
    changesPercentage: 1.5,
    change: 2.25,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: PortfolioRepository,
          useValue: {
            findUserPortfolio: jest.fn(),
            addStock: jest.fn(),
            removeStock: jest.fn(),
            isStockInPortfolio: jest.fn(),
          },
        },
        {
          provide: FmpApiService,
          useValue: {
            getStockQuote: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    portfolioRepository = module.get<PortfolioRepository>(PortfolioRepository);
    fmpApiService = module.get<FmpApiService>(FmpApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserPortfolio', () => {
    it('should return user portfolio items', async () => {
      // Setup
      jest
        .spyOn(portfolioRepository, 'findUserPortfolio')
        .mockResolvedValue(mockPortfolioItems);

      // Execute
      const result = await service.getUserPortfolio(userId);

      // Verify
      expect(result).toEqual(mockPortfolioItems);
      expect(portfolioRepository.findUserPortfolio).toHaveBeenCalledWith(
        expect.any(Types.ObjectId)
      );
    });

    it('should throw BadRequestException for invalid user ID', async () => {
      // Execute & Verify
      await expect(service.getUserPortfolio('invalid-id')).rejects.toThrow(
        BadRequestException
      );
      expect(portfolioRepository.findUserPortfolio).not.toHaveBeenCalled();
    });
  });

  describe('addStockToPortfolio', () => {
    it('should add a stock to portfolio when valid', async () => {
      // Setup
      jest
        .spyOn(fmpApiService, 'getStockQuote')
        .mockResolvedValue(mockStockQuote);
      jest
        .spyOn(portfolioRepository, 'isStockInPortfolio')
        .mockResolvedValue(false);
      jest
        .spyOn(portfolioRepository, 'addStock')
        .mockResolvedValue(mockPortfolioItem);

      // Execute
      const result = await service.addStockToPortfolio(userId, stockSymbol);

      // Verify
      expect(result).toEqual(mockPortfolioItem);
      expect(fmpApiService.getStockQuote).toHaveBeenCalledWith(stockSymbol);
      expect(portfolioRepository.isStockInPortfolio).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        stockSymbol
      );
      expect(portfolioRepository.addStock).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        stockSymbol
      );
    });

    it('should throw ConflictException when stock already in portfolio', async () => {
      // Setup
      jest
        .spyOn(fmpApiService, 'getStockQuote')
        .mockResolvedValue(mockStockQuote);
      jest
        .spyOn(portfolioRepository, 'isStockInPortfolio')
        .mockResolvedValue(true);

      // Execute & Verify
      await expect(
        service.addStockToPortfolio(userId, stockSymbol)
      ).rejects.toThrow(ConflictException);
      expect(portfolioRepository.addStock).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when stock not found', async () => {
      // Setup
      jest
        .spyOn(fmpApiService, 'getStockQuote')
        .mockRejectedValue(
          new Error('No quote data found for symbol: INVALID')
        );

      // Execute & Verify
      await expect(
        service.addStockToPortfolio(userId, 'INVALID')
      ).rejects.toThrow(NotFoundException);
      expect(portfolioRepository.isStockInPortfolio).not.toHaveBeenCalled();
      expect(portfolioRepository.addStock).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid user ID', async () => {
      // Execute & Verify
      await expect(
        service.addStockToPortfolio('invalid-id', stockSymbol)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeStockFromPortfolio', () => {
    it('should remove a stock from portfolio when valid', async () => {
      // Setup
      jest.spyOn(portfolioRepository, 'removeStock').mockResolvedValue(true);

      // Execute
      await service.removeStockFromPortfolio(userId, stockSymbol);

      // Verify
      expect(portfolioRepository.removeStock).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        stockSymbol
      );
    });

    it('should throw NotFoundException when stock not in portfolio', async () => {
      // Setup
      jest.spyOn(portfolioRepository, 'removeStock').mockResolvedValue(false);

      // Execute & Verify
      await expect(
        service.removeStockFromPortfolio(userId, 'INVALID')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid user ID', async () => {
      // Execute & Verify
      await expect(
        service.removeStockFromPortfolio('invalid-id', stockSymbol)
      ).rejects.toThrow(BadRequestException);
      expect(portfolioRepository.removeStock).not.toHaveBeenCalled();
    });
  });
});
