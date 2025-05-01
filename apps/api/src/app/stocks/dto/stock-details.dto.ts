import { ApiProperty } from '@nestjs/swagger';
import { StockQuoteDto } from './stock-quote.dto';

export class StockDetailsDto extends StockQuoteDto {
  @ApiProperty({
    description: 'Company website',
    example: 'https://www.apple.com',
  })
  website?: string;

  @ApiProperty({ description: 'Company description' })
  description?: string;

  @ApiProperty({ description: 'Company CEO', example: 'Tim Cook' })
  ceo?: string;

  @ApiProperty({ description: 'Industry', example: 'Consumer Electronics' })
  industry?: string;

  @ApiProperty({ description: 'Sector', example: 'Technology' })
  sector?: string;

  @ApiProperty({ description: 'Price-to-Earnings ratio', example: 28.92 })
  pe?: number;

  @ApiProperty({ description: 'Earnings per share', example: 6.31 })
  eps?: number;

  @ApiProperty({ description: 'Beta value (stock volatility)', example: 1.28 })
  beta?: number;
}
