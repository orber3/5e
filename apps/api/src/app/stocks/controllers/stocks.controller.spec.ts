import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { FmpApiService } from '../services/fmp-api.service';
import { StockQuoteDto } from '../dto/stock-quote.dto';
import { StockDetailsDto } from '../dto/stock-details.dto';
import { StockSearchResultDto } from '../dto/stock-search-result.dto';

describe('StocksController', () => {
  let controller: StocksController;
  let fmpApiService: FmpApiService;

  // Mock data
  const mockQuote: StockQuoteDto = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.25,
    changesPercentage: 1.5,
    change: 2.25,
  };

  const mockDetails: StockDetailsDto = {
    ...mockQuote,
    website: 'https://www.apple.com',
    industry: 'Consumer Electronics',
    sector: 'Technology',
    ceo: 'Tim Cook',
  };

  const mockSearchResults: StockSearchResultDto[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'AAPL.BA', name: 'Apple Inc.', exchange: 'BCBA', type: 'stock' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: FmpApiService,
          useValue: {
            searchStocks: jest.fn(),
            getStockQuote: jest.fn(),
            getStockDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
    fmpApiService = module.get<FmpApiService>(FmpApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchStocks', () => {
    it('should return stocks matching a search query', async () => {
      jest
        .spyOn(fmpApiService, 'searchStocks')
        .mockResolvedValue(mockSearchResults);

      const result = await controller.searchStocks('apple');

      expect(result).toEqual({ results: mockSearchResults });
      expect(fmpApiService.searchStocks).toHaveBeenCalledWith('apple');
    });

    it('should throw BadRequestException when query is too short', async () => {
      await expect(controller.searchStocks('a')).rejects.toThrow(
        BadRequestException
      );
      expect(fmpApiService.searchStocks).not.toHaveBeenCalled();
    });

    it('should handle API errors and throw BadRequestException', async () => {
      jest
        .spyOn(fmpApiService, 'searchStocks')
        .mockRejectedValue(new Error('API error'));

      await expect(controller.searchStocks('apple')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getStockQuote', () => {
    it('should return a stock quote', async () => {
      jest.spyOn(fmpApiService, 'getStockQuote').mockResolvedValue(mockQuote);

      const result = await controller.getStockQuote('AAPL');

      expect(result).toEqual(mockQuote);
      expect(fmpApiService.getStockQuote).toHaveBeenCalledWith('AAPL');
    });

    it('should convert symbol to uppercase', async () => {
      jest.spyOn(fmpApiService, 'getStockQuote').mockResolvedValue(mockQuote);

      await controller.getStockQuote('aapl');

      expect(fmpApiService.getStockQuote).toHaveBeenCalledWith('AAPL');
    });

    it('should throw NotFoundException when stock not found', async () => {
      jest
        .spyOn(fmpApiService, 'getStockQuote')
        .mockRejectedValue(
          new Error('No quote data found for symbol: INVALID')
        );

      await expect(controller.getStockQuote('INVALID')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getStockDetails', () => {
    it('should return detailed stock information', async () => {
      jest
        .spyOn(fmpApiService, 'getStockDetails')
        .mockResolvedValue(mockDetails);

      const result = await controller.getStockDetails('AAPL');

      expect(result).toEqual(mockDetails);
      expect(fmpApiService.getStockDetails).toHaveBeenCalledWith('AAPL');
    });

    it('should convert symbol to uppercase', async () => {
      jest
        .spyOn(fmpApiService, 'getStockDetails')
        .mockResolvedValue(mockDetails);

      await controller.getStockDetails('aapl');

      expect(fmpApiService.getStockDetails).toHaveBeenCalledWith('AAPL');
    });

    it('should throw NotFoundException when stock not found', async () => {
      jest
        .spyOn(fmpApiService, 'getStockDetails')
        .mockRejectedValue(
          new Error('No quote data found for symbol: INVALID')
        );

      await expect(controller.getStockDetails('INVALID')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
