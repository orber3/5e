import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStockDto {
  @ApiProperty({
    description: 'The stock symbol to add to the portfolio (e.g., AAPL, MSFT)',
    example: 'AAPL',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  stockSymbol!: string;
}
