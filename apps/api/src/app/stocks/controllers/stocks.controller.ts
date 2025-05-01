import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FmpApiService } from '../services/fmp-api.service';
import { StockQuoteDto } from '../dto/stock-quote.dto';
import { StockDetailsDto } from '../dto/stock-details.dto';
import {
  StockSearchResultDto,
  StockSearchResponseDto,
} from '../dto/stock-search-result.dto';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  private readonly logger = new Logger(StocksController.name);

  constructor(private fmpApiService: FmpApiService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for stocks by symbol or name' })
  @ApiQuery({ name: 'query', required: true, description: 'Search term' })
  @ApiResponse({
    status: 200,
    description: 'List of stocks matching the search',
    type: StockSearchResponseDto,
  })
  async searchStocks(
    @Query('query') query: string
  ): Promise<{ results: StockSearchResultDto[] }> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException(
        'Search query must be at least 2 characters'
      );
    }

    try {
      const results = await this.fmpApiService.searchStocks(query);
      return { results };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error searching stocks: ${errorMessage}`);
      throw new BadRequestException('Error searching for stocks');
    }
  }

  @Get('search-name')
  @ApiOperation({ summary: 'Search for companies by name' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Company name search term',
  })
  @ApiResponse({
    status: 200,
    description: 'List of companies matching the search',
    type: StockSearchResponseDto,
  })
  async searchCompaniesByName(
    @Query('query') query: string
  ): Promise<{ results: StockSearchResultDto[] }> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException(
        'Search query must be at least 2 characters'
      );
    }

    try {
      const results = await this.fmpApiService.searchCompaniesByName(query);
      return { results };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error searching companies: ${errorMessage}`);
      throw new BadRequestException('Error searching for companies');
    }
  }

  @Get(':symbol/quote')
  @ApiOperation({
    summary: 'Get stock quote with current price and percentage change',
  })
  @ApiParam({ name: 'symbol', description: 'Stock symbol (e.g., AAPL)' })
  @ApiResponse({
    status: 200,
    description: 'Stock quote information',
    type: StockQuoteDto,
  })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async getStockQuote(@Param('symbol') symbol: string): Promise<StockQuoteDto> {
    try {
      return await this.fmpApiService.getStockQuote(symbol.toUpperCase());
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error getting quote for ${symbol}: ${errorMessage}`);

      if (errorMessage.includes('No quote data found')) {
        throw new NotFoundException(`Stock symbol ${symbol} not found`);
      }

      throw new BadRequestException('Error retrieving stock quote');
    }
  }

  @Get(':symbol/details')
  @ApiOperation({ summary: 'Get detailed stock information' })
  @ApiParam({ name: 'symbol', description: 'Stock symbol (e.g., AAPL)' })
  @ApiResponse({
    status: 200,
    description: 'Detailed stock information',
    type: StockDetailsDto,
  })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async getStockDetails(
    @Param('symbol') symbol: string
  ): Promise<StockDetailsDto> {
    try {
      return await this.fmpApiService.getStockDetails(symbol.toUpperCase());
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error getting details for ${symbol}: ${errorMessage}`);

      if (errorMessage.includes('No quote data found')) {
        throw new NotFoundException(`Stock symbol ${symbol} not found`);
      }

      throw new BadRequestException('Error retrieving stock details');
    }
  }
}
