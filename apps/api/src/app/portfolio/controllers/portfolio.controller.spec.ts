import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from '../services/portfolio.service';
import { FmpApiService } from '../../stocks/services/fmp-api.service';
import { Portfolio } from '../schemas/portfolio.schema';
import { AddStockDto } from '../dto/add-stock.dto';
import { StockQuoteDto } from '../../stocks/dto/stock-quote.dto';

describe('PortfolioController', () => {
  let controller: PortfolioController;
  let portfolioService: PortfolioService;
  let fmpApiService: FmpApiService;

  // Mock data
  const userId = new Types.ObjectId().toString();
  const stockSymbol = 'AAPL';

  const mockUser = { id: userId };

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

  const mockStockQuote: StockQuoteDto = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.25,
    changesPercentage: 1.5,
    change: 2.25,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [
        {
          provide: PortfolioService,
          useValue: {
            getUserPortfolio: jest.fn(),
            addStockToPortfolio: jest.fn(),
            removeStockFromPortfolio: jest.fn(),
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

    controller = module.get<PortfolioController>(PortfolioController);
    portfolioService = module.get<PortfolioService>(PortfolioService);
    fmpApiService = module.get<FmpApiService>(FmpApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserPortfolio', () => {
    it('should return user portfolio with stock quotes', async () => {
      // Setup
      jest
        .spyOn(portfolioService, 'getUserPortfolio')
        .mockResolvedValue(mockPortfolioItems);
      jest
        .spyOn(fmpApiService, 'getStockQuote')
        .mockResolvedValue(mockStockQuote);

      // Execute
      const result = await controller.getUserPortfolio(mockUser);

      // Verify
      expect(result).toEqual({
        stocks: [
          expect.objectContaining({
            symbol: 'AAPL',
            quote: mockStockQuote,
          }),
          expect.objectContaining({
            symbol: 'MSFT',
            quote: mockStockQuote,
          }),
          expect.objectContaining({
            symbol: 'GOOGL',
            quote: mockStockQuote,
          }),
        ],
      });
      expect(portfolioService.getUserPortfolio).toHaveBeenCalledWith(userId);
      expect(fmpApiService.getStockQuote).toHaveBeenCalledTimes(3);
    });

    it('should handle empty portfolio', async () => {
      // Setup
      jest.spyOn(portfolioService, 'getUserPortfolio').mockResolvedValue([]);

      // Execute
      const result = await controller.getUserPortfolio(mockUser);

      // Verify
      expect(result).toEqual({ stocks: [] });
      expect(fmpApiService.getStockQuote).not.toHaveBeenCalled();
    });
  });

  describe('addStockToPortfolio', () => {
    it('should add a stock to portfolio', async () => {
      // Setup
      const addStockDto: AddStockDto = { stockSymbol };
      jest
        .spyOn(portfolioService, 'addStockToPortfolio')
        .mockResolvedValue(mockPortfolioItem);

      // Execute
      const result = await controller.addStockToPortfolio(
        mockUser,
        addStockDto
      );

      // Verify
      expect(result).toEqual({
        message: `${stockSymbol} added to portfolio`,
        stock: mockPortfolioItem,
      });
      expect(portfolioService.addStockToPortfolio).toHaveBeenCalledWith(
        userId,
        stockSymbol.toUpperCase()
      );
    });

    it('should convert symbol to uppercase', async () => {
      // Setup
      const addStockDto: AddStockDto = { stockSymbol: 'aapl' };
      jest
        .spyOn(portfolioService, 'addStockToPortfolio')
        .mockResolvedValue(mockPortfolioItem);

      // Execute
      await controller.addStockToPortfolio(mockUser, addStockDto);

      // Verify
      expect(portfolioService.addStockToPortfolio).toHaveBeenCalledWith(
        userId,
        'AAPL'
      );
    });
  });

  describe('removeStockFromPortfolio', () => {
    it('should remove a stock from portfolio', async () => {
      // Setup
      jest
        .spyOn(portfolioService, 'removeStockFromPortfolio')
        .mockResolvedValue();

      // Execute
      await controller.removeStockFromPortfolio(mockUser, stockSymbol);

      // Verify
      expect(portfolioService.removeStockFromPortfolio).toHaveBeenCalledWith(
        userId,
        stockSymbol.toUpperCase()
      );
    });

    it('should convert symbol to uppercase', async () => {
      // Setup
      jest
        .spyOn(portfolioService, 'removeStockFromPortfolio')
        .mockResolvedValue();

      // Execute
      await controller.removeStockFromPortfolio(mockUser, 'aapl');

      // Verify
      expect(portfolioService.removeStockFromPortfolio).toHaveBeenCalledWith(
        userId,
        'AAPL'
      );
    });
  });
});
