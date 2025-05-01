import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { FmpApiService } from './fmp-api.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('FmpApiService', () => {
  let service: FmpApiService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
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

      // Second call should use cache
      await service.getStockQuote('AAPL');

      // HTTP service should only be called once despite two service calls
      expect(getSpy).toHaveBeenCalledTimes(1);
    });
  });
});
