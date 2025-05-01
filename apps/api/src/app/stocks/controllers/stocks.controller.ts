import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Logger,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FmpApiService } from '../services/fmp-api.service';
import { StockQuoteDto } from '../dto/stock-quote.dto';
import { StockDetailsDto } from '../dto/stock-details.dto';
import {
  StockSearchResultDto,
  StockSearchResponseDto,
} from '../dto/stock-search-result.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('stocks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('stocks')
export class StocksController {
  private readonly logger = new Logger(StocksController.name);

  constructor(private fmpApiService: FmpApiService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for stocks by symbol' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search term for stock symbols',
  })
  @ApiResponse({
    status: 200,
    description: 'List of stocks matching the symbol search',
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
      this.logger.error(`Error searching stocks by symbol: ${errorMessage}`);
      throw new BadRequestException('Error searching for stocks by symbol');
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
    description: 'List of companies matching the name search',
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
      this.logger.error(`Error searching companies by name: ${errorMessage}`);
      throw new BadRequestException('Error searching for companies by name');
    }
  }

  @Get('search-combined')
  @ApiOperation({
    summary: 'Search for stocks by both symbol and company name',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description:
      'Search term to match against both stock symbols and company names',
  })
  @ApiResponse({
    status: 200,
    description: 'List of stocks matching the search by symbol or name',
    type: StockSearchResponseDto,
  })
  async searchStocksBySymbolAndName(
    @Query('query') query: string
  ): Promise<{ results: StockSearchResultDto[] }> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException(
        'Search query must be at least 2 characters'
      );
    }

    try {
      // Search by both symbol and name
      const [symbolResults, nameResults] = await Promise.all([
        this.fmpApiService.searchStocks(query),
        this.fmpApiService.searchCompaniesByName(query),
      ]);

      // Deduplicate results using a Map with symbol as key
      const resultsMap = new Map<string, StockSearchResultDto>();

      // Add symbol results to the map
      symbolResults.forEach((stock) => {
        resultsMap.set(stock.symbol, stock);
      });

      // Add name results, not overwriting existing entries
      nameResults.forEach((stock) => {
        if (!resultsMap.has(stock.symbol)) {
          resultsMap.set(stock.symbol, stock);
        }
      });

      // Convert map back to array
      const combinedResults = Array.from(resultsMap.values());

      return { results: combinedResults };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error in combined stock search: ${errorMessage}`);
      throw new BadRequestException('Error searching for stocks');
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
