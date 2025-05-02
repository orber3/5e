# Stocks Module

This module provides stock market data functionality for the API:

## Features

- Stock search by symbol and company name
- Real-time stock quotes and details
- Integration with Financial Modeling Prep API
- Caching for improved performance
- Swagger documentation

## API Endpoints

- `GET /api/stocks/search` - Search for stocks by symbol
- `GET /api/stocks/search-name` - Search for companies by name
- `GET /api/stocks/search-combined` - Search for stocks by both symbol and name
- `GET /api/stocks/:symbol/quote` - Get stock quote with current price
- `GET /api/stocks/:symbol/details` - Get detailed stock information

## DTOs

The module includes the following DTOs:

- `StockQuoteDto` - Contains current stock price information
- `StockDetailsDto` - Extends quote with additional company information
- `StockSearchResultDto` - Stock symbol search result

## Services

The module uses `FmpApiService` to interact with the Financial Modeling Prep API:

- Fetches stock data from external API
- Implements caching to reduce API calls
- Handles error cases and provides meaningful messages

## Caching

The module implements caching with the following configuration:

```typescript
CacheModule.register({
  ttl: 15 * 60, // 15 minutes in seconds
  max: 100, // Maximum number of items in cache
});
```

## Authentication

All stock endpoints require authentication with JwtAuthGuard:

```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('stocks')
export class StocksController {
  // ...
}
```

## Usage

To use the stocks module in other parts of the application:

```typescript
import { StocksModule } from '../stocks/stocks.module';
import { FmpApiService } from '../stocks/services/fmp-api.service';

@Module({
  imports: [StocksModule],
  // ...
})
export class YourModule {
  constructor(private fmpApiService: FmpApiService) {}

  // Now you can use fmpApiService methods
}
```
