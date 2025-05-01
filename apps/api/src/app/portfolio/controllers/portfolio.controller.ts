import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PortfolioService } from '../services/portfolio.service';
import { AddStockDto } from '../dto/add-stock.dto';
import { Portfolio } from '../schemas/portfolio.schema';
import { User as CurrentUser } from '../../users/decorators/user.decorator';
import { FmpApiService } from '../../stocks/services/fmp-api.service';
import { StockQuoteDto } from '../../stocks/dto/stock-quote.dto';

@ApiTags('portfolio')
@Controller('portfolio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PortfolioController {
  private readonly logger = new Logger(PortfolioController.name);

  constructor(
    private portfolioService: PortfolioService,
    private fmpApiService: FmpApiService
  ) {}

  @Get()
  @ApiOperation({ summary: "Get user's portfolio" })
  @ApiResponse({
    status: 200,
    description: "User's portfolio with stock information",
  })
  async getUserPortfolio(@CurrentUser() user: { id: string }): Promise<{
    stocks: Array<{
      symbol: string;
      quote?: StockQuoteDto;
      addedAt: Date;
    }>;
  }> {
    this.logger.debug(`Fetching portfolio for user ${user.id}`);

    // Get the user's portfolio items
    const portfolioItems = await this.portfolioService.getUserPortfolio(
      user.id
    );

    // If portfolio is empty, return empty array
    if (!portfolioItems.length) {
      return { stocks: [] };
    }

    // Fetch quotes for each stock in the portfolio
    const stocksWithQuotes = await Promise.all(
      portfolioItems.map(async (item) => {
        try {
          const quote = await this.fmpApiService.getStockQuote(
            item.stockSymbol
          );
          return {
            symbol: item.stockSymbol,
            quote,
            addedAt: (item as any).createdAt,
          };
        } catch (error) {
          // If quote fetch fails, return just the symbol
          return {
            symbol: item.stockSymbol,
            addedAt: (item as any).createdAt,
          };
        }
      })
    );

    return { stocks: stocksWithQuotes };
  }

  @Post()
  @ApiOperation({ summary: 'Add a stock to portfolio' })
  @ApiResponse({
    status: 201,
    description: 'Stock added to portfolio',
  })
  async addStockToPortfolio(
    @CurrentUser() user: { id: string },
    @Body() addStockDto: AddStockDto
  ): Promise<{ message: string; stock: Portfolio }> {
    this.logger.debug(
      `Adding stock ${addStockDto.stockSymbol} to portfolio of user ${user.id}`
    );

    const stock = await this.portfolioService.addStockToPortfolio(
      user.id,
      addStockDto.stockSymbol.toUpperCase()
    );

    return {
      message: `${addStockDto.stockSymbol} added to portfolio`,
      stock,
    };
  }

  @Delete(':symbol')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a stock from portfolio' })
  @ApiParam({ name: 'symbol', description: 'Stock symbol to remove' })
  @ApiResponse({
    status: 204,
    description: 'Stock removed from portfolio',
  })
  async removeStockFromPortfolio(
    @CurrentUser() user: { id: string },
    @Param('symbol') symbol: string
  ): Promise<void> {
    this.logger.debug(
      `Removing stock ${symbol} from portfolio of user ${user.id}`
    );

    await this.portfolioService.removeStockFromPortfolio(
      user.id,
      symbol.toUpperCase()
    );

    // 204 No Content response will be sent automatically due to @HttpCode
  }
}
