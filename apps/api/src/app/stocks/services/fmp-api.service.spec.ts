import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { FmpApiService } from './fmp-api.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('FmpApiService', () => {
  let service: FmpApiService;
  let httpService: HttpService;
  let configService: ConfigService;
  let cacheManager: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    // Create cache manager mock
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        FmpApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key, defaultValue) => {
              if (key === 'FMP_API_KEY') {
                return 'mock-api-key';
              }
              return defaultValue;
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    service = module.get<FmpApiService>(FmpApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchStocks', () => {
    it('should return stocks matching a search query', async () => {
      const mockResults = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          exchange: 'NASDAQ',
          type: 'stock',
        },
        {
          symbol: 'AAPL.BA',
          name: 'Apple Inc.',
          exchange: 'BCBA',
          type: 'stock',
        },
      ];

      // Mock cache miss
      cacheManager.get.mockResolvedValueOnce(null);

      jest.spyOn(httpService, 'get').mockImplementation(() =>
        of({
          data: mockResults,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url: '' },
        } as AxiosResponse)
      );

      const result = await service.searchStocks('AAPL');

      expect(result).toEqual(mockResults);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('search-symbol?query=AAPL&apikey=mock-api-key')
      );
    });

    it('should throw an error when API request fails', async () => {
      // Mock cache miss
      cacheManager.get.mockResolvedValueOnce(null);

      jest.spyOn(httpService, 'get').mockImplementation(() =>
        throwError(
          () =>
            ({
              response: { status: 500 },
              message: 'API Error',
            } as AxiosError)
        )
      );

      await expect(service.searchStocks('AAPL')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getStockQuote', () => {
    it('should return stock quote data', async () => {
      const mockQuote = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.25,
          changesPercentage: 1.5,
          change: 2.25,
          dayLow: 148.75,
          dayHigh: 151.25,
        },
      ];

      // Mock cache miss
      cacheManager.get.mockResolvedValueOnce(null);

      jest.spyOn(httpService, 'get').mockImplementation(() =>
        of({
          data: mockQuote,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url: '' },
        } as AxiosResponse)
      );

      const result = await service.getStockQuote('AAPL');

      expect(result).toEqual(mockQuote[0]);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('quote?symbol=AAPL&apikey=mock-api-key')
      );
    });

    it('should throw an error when no quote data is found', async () => {
      // Mock cache miss
      cacheManager.get.mockResolvedValueOnce(null);

      jest.spyOn(httpService, 'get').mockImplementation(() =>
        of({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url: '' },
        } as AxiosResponse)
      );

      await expect(service.getStockQuote('INVALID')).rejects.toThrow(
        'No quote data found for symbol: INVALID'
      );
    });
  });

  describe('getStockDetails', () => {
    it('should return combined stock quote and profile data', async () => {
      const mockQuote = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.25,
          changesPercentage: 1.5,
          change: 2.25,
        },
      ];

      const mockProfile = [
        {
          symbol: 'AAPL',
          website: 'https://www.apple.com',
          industry: 'Consumer Electronics',
          sector: 'Technology',
          ceo: 'Tim Cook',
        },
      ];

      // Mock getStockQuote and makeRequest
      jest.spyOn(service, 'getStockQuote').mockResolvedValue(mockQuote[0]);

      // Mock cache miss for profile request
      cacheManager.get.mockResolvedValueOnce(null);

      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        if (url.includes('profile')) {
          return of({
            data: mockProfile,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url: '' },
          } as AxiosResponse);
        }
        return of({} as AxiosResponse);
      });

      const result = await service.getStockDetails('AAPL');

      expect(result).toEqual({
        ...mockQuote[0],
        ...mockProfile[0],
      });
      expect(service.getStockQuote).toHaveBeenCalledWith('AAPL');
    });

    it('should return just quote data if no profile data is available', async () => {
      const mockQuote = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 150.25,
        changesPercentage: 1.5,
        change: 2.25,
      };

      // Mock getStockQuote and makeRequest
      jest.spyOn(service, 'getStockQuote').mockResolvedValue(mockQuote);

      // Mock cache miss for profile request
      cacheManager.get.mockResolvedValueOnce(null);

      jest.spyOn(httpService, 'get').mockImplementation((url) => {
        if (url.includes('profile')) {
          return of({
            data: [],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { url: '' },
          } as AxiosResponse);
        }
        return of({} as AxiosResponse);
      });

      const result = await service.getStockDetails('AAPL');

      expect(result).toEqual(mockQuote);
    });
  });

  // Test caching behavior
  describe('caching', () => {
    it('should cache API responses for subsequent requests', async () => {
      const mockQuote = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.25,
        },
      ];

      // First call - cache miss
      cacheManager.get.mockResolvedValueOnce(null);

      // Set up spy to track calls to HTTP service
      const getSpy = jest.spyOn(httpService, 'get').mockImplementation(() =>
        of({
          data: mockQuote,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url: '' },
        } as AxiosResponse)
      );

      // First call should make a real request
      await service.getStockQuote('AAPL');
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(cacheManager.set).toHaveBeenCalled();

      // Second call - cache hit
      cacheManager.get.mockResolvedValueOnce(mockQuote[0]);

      // Second call should use cache
      await service.getStockQuote('AAPL');

      // HTTP service should not be called twice
      expect(getSpy).toHaveBeenCalledTimes(1);
    });
  });
});
