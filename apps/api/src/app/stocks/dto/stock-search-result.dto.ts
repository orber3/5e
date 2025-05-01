import { ApiProperty } from '@nestjs/swagger';

export class StockSearchResultDto {
  @ApiProperty({ description: 'Stock symbol/ticker', example: 'AAPL' })
  symbol!: string;

  @ApiProperty({ description: 'Company name', example: 'Apple Inc.' })
  name!: string;

  @ApiProperty({
    description: 'Exchange where the stock is listed',
    example: 'NASDAQ',
  })
  exchange?: string;

  @ApiProperty({ description: 'Type of security', example: 'stock' })
  type?: string;
}

export class StockSearchResponseDto {
  @ApiProperty({
    description: 'Array of stock search results',
    type: [StockSearchResultDto],
  })
  results!: StockSearchResultDto[];
}
