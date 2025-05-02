# Portfolio Module

This module provides portfolio management functionality for the API:

## Features

- User stock portfolio management
- Add/remove stocks from portfolio
- Integration with Stocks module for real-time data
- MongoDB schema with Mongoose
- Repository pattern implementation
- Swagger documentation

## API Endpoints

- `GET /api/portfolio` - Get user's portfolio with stock information
- `POST /api/portfolio` - Add a stock to portfolio
- `DELETE /api/portfolio/:symbol` - Remove a stock from portfolio

## MongoDB Schema

The portfolio schema includes:

- User reference (ObjectId linked to User schema)
- Stock symbol
- Timestamps (createdAt, updatedAt)

The schema includes a compound index to prevent duplicate stocks in a user's portfolio:

```typescript
PortfolioSchema.index({ userId: 1, stockSymbol: 1 }, { unique: true });
```

## DTOs

The module includes:

- `AddStockDto` - For adding stocks to portfolio with validation

## Repository Pattern

The module implements the repository pattern:

- `PortfolioRepository` handles all database interactions
- Provides clean separation of concerns
- Better testability with mocking

## Integration with Stocks Module

The Portfolio module integrates with the Stocks module:

- Uses `FmpApiService` to validate stock symbols
- Fetches real-time stock quotes for portfolio items
- Includes stock information in portfolio responses

## Authentication

All portfolio endpoints require authentication with JwtAuthGuard:

```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('portfolio')
export class PortfolioController {
  // ...
}
```

## Usage

To use the Portfolio module in other parts of the application:

```typescript
import { PortfolioModule } from '../portfolio/portfolio.module';
import { PortfolioService } from '../portfolio/services/portfolio.service';

@Module({
  imports: [PortfolioModule],
  // ...
})
export class YourModule {
  constructor(private portfolioService: PortfolioService) {}

  // Now you can use portfolioService methods
}
```
