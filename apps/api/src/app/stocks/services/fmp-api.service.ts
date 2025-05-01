import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { StockQuoteDto } from '../dto/stock-quote.dto';
import { StockDetailsDto } from '../dto/stock-details.dto';
import { StockSearchResultDto } from '../dto/stock-search-result.dto';

@Injectable()
export class FmpApiService {
  private readonly logger = new Logger(FmpApiService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://financialmodelingprep.com/stable';
  private readonly cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor(
    private configService: ConfigService,
    private httpService: HttpService
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
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached.data as T;
    }

    // Add API key to params
    const queryParams = { ...params, apikey: this.apiKey };

    // Build URL with query parameters
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${this.baseUrl}/${endpoint}?${queryString}`;

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
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      });

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

  async searchStocks(query: string): Promise<StockSearchResultDto[]> {
    return this.makeRequest<StockSearchResultDto[]>('search-symbol', {
      query,
    });
  }

  async searchCompaniesByName(query: string): Promise<StockSearchResultDto[]> {
    return this.makeRequest<StockSearchResultDto[]>('search-name', {
      query,
    });
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
