# Stock Portfolio API

Backend API for the Stock Portfolio application.

## Features

- User authentication and portfolio management
- Stock search functionality
- Real-time stock quotes and details
- Integration with Financial Modeling Prep API

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following content:

   ```
   # MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/stockapp

   # JWT Secret for authentication
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRATION=1d

   # Financial Modeling Prep API Key
   # Get one from https://site.financialmodelingprep.com/developer
   FMP_API_KEY=your_fmp_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Routes

### Portfolio Management (Authenticated)

- `GET /api/portfolio` - Get user's stock portfolio
- `POST /api/portfolio` - Add a stock to portfolio
  ```json
  {
    "stockSymbol": "AAPL"
  }
  ```
- `DELETE /api/portfolio/:symbol` - Remove a stock from portfolio

### Stock Information (Public)

- `GET /api/stocks/search?query=apple` - Search for stocks by name or symbol
- `GET /api/stocks/:symbol/quote` - Get latest stock quote with percentage change
- `GET /api/stocks/:symbol/details` - Get expanded details of a stock

## Authentication

All portfolio endpoints require authentication using JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Get a token by logging in via the `/api/auth/login` endpoint.
