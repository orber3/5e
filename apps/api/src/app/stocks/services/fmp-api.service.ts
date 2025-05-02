import {
  Injectable,
  Logger,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { StockQuoteDto } from '../dto/stock-quote.dto';
import { StockDetailsDto } from '../dto/stock-details.dto';
import { StockSearchResultDto } from '../dto/stock-search-result.dto';

@Injectable()
export class FmpApiService {
  private readonly logger = new Logger(FmpApiService.name);
  private readonly apiKey: string; // in a real app it will be controlled from a secret manager.(eg. aws secrets manager)
  private readonly baseUrl = 'https://financialmodelingprep.com/api/v3'; // in a real app it will be controlled from remote KV store.
  private readonly CACHE_DURATION = 15 * 60; // 15 minutes in seconds (in real app it will be controlled from remote KV store.)

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.apiKey = this.configService.get<string>('FMP_API_KEY', '');
    if (!this.apiKey) {
      this.logger.warn('FMP_API_KEY is not set. API calls will fail.');
    }
  }

  private getCacheKey(
    endpoint: string,
    params: Record<string, string>
  ): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);

    // Check cache first
    const cachedData = await this.cacheManager.get<T>(cacheKey);
    if (cachedData) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cachedData;
    }

    // Add API key to params
    const queryParams = { ...params, apikey: this.apiKey };

    // Build URL with query parameters
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Handle special case for quote endpoint with symbol parameter
    let url: string;
    if (endpoint === 'quote' && params.symbol) {
      // For quote endpoint in legacy API, symbol is part of the URL path
      url = `${this.baseUrl}/${endpoint}/${params.symbol}?apikey=${this.apiKey}`;
    } else {
      url = `${this.baseUrl}/${endpoint}?${queryString}`;
    }

    this.logger.debug(`Making API request to ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url).pipe(
          map((res: AxiosResponse<T>) => res.data),
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error calling Financial Modeling Prep API: ${error.message}`,
              error.stack
            );
            throw new InternalServerErrorException(
              'Failed to fetch data from stock API'
            );
          })
        )
      );

      // Cache the successful response
      await this.cacheManager.set(cacheKey, response, this.CACHE_DURATION);

      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Error in makeRequest for ${endpoint}: ${errorMessage}`,
        errorStack
      );
      throw error;
    }
  }

  async searchStocks(
    query: string,
    limit?: number,
    exchange?: string
  ): Promise<StockSearchResultDto[]> {
    const params: Record<string, string> = { query };

    if (limit) {
      params.limit = limit.toString();
    }

    if (exchange) {
      params.exchange = exchange;
    }

    return this.makeRequest<StockSearchResultDto[]>('search-ticker', params);
  }

  async searchCompaniesByName(
    query: string,
    limit?: number,
    exchange?: string
  ): Promise<StockSearchResultDto[]> {
    const params: Record<string, string> = { query };

    if (limit) {
      params.limit = limit.toString();
    }

    if (exchange) {
      params.exchange = exchange;
    }

    return this.makeRequest<StockSearchResultDto[]>('search-name', params);
  }

  async getStockQuote(symbol: string): Promise<StockQuoteDto> {
    const quotes = await this.makeRequest<StockQuoteDto[]>('quote', {
      symbol,
    });

    if (!quotes || quotes.length === 0) {
      throw new Error(`No quote data found for symbol: ${symbol}`);
    }

    return quotes[0];
  }

  async getStockDetails(symbol: string): Promise<StockDetailsDto> {
    // First, get the quote information
    const quote = await this.getStockQuote(symbol);

    // Then, get additional profile information
    const profiles = await this.makeRequest<Partial<StockDetailsDto>[]>(
      'profile',
      {
        symbol,
      }
    );

    if (!profiles || profiles.length === 0) {
      // Return just the quote data if profile isn't available
      return quote as StockDetailsDto;
    }

    // Merge quote and profile data
    const profile = profiles[0];
    return {
      ...quote,
      ...profile,
    };
  }
}
