import { ApiProperty } from '@nestjs/swagger';

export class StockQuoteDto {
  @ApiProperty({ description: 'Stock symbol/ticker', example: 'AAPL' })
  symbol!: string;

  @ApiProperty({ description: 'Company name', example: 'Apple Inc.' })
  name!: string;

  @ApiProperty({ description: 'Current stock price', example: 182.63 })
  price!: number;

  @ApiProperty({ description: 'Percentage change for the day', example: 1.25 })
  changesPercentage!: number;

  @ApiProperty({
    description: 'Absolute price change for the day',
    example: 2.25,
  })
  change!: number;

  @ApiProperty({ description: 'Lowest price of the day', example: 180.1 })
  dayLow?: number;

  @ApiProperty({ description: 'Highest price of the day', example: 183.25 })
  dayHigh?: number;

  @ApiProperty({ description: '52-week high price', example: 198.23 })
  yearHigh?: number;

  @ApiProperty({ description: '52-week low price', example: 124.17 })
  yearLow?: number;

  @ApiProperty({ description: 'Market capitalization', example: 2850000000000 })
  marketCap?: number;

  @ApiProperty({ description: '50-day moving average price', example: 178.45 })
  priceAvg50?: number;

  @ApiProperty({ description: '200-day moving average price', example: 165.32 })
  priceAvg200?: number;

  @ApiProperty({ description: 'Trading volume for the day', example: 58642123 })
  volume?: number;

  @ApiProperty({ description: 'Average trading volume', example: 62458741 })
  avgVolume?: number;

  @ApiProperty({
    description: 'Timestamp of the quote in milliseconds',
    example: 1652882400000,
  })
  timestamp?: number;
}
