# Authentication Module

This module provides authentication functionality for the API:

## Features

- User registration
- User login with JWT token
- Cookie-based authentication with JWT fallback
- Protected routes with JWT guard
- Swagger documentation

## Authentication Flow

The authentication flow in this module is based on JWT tokens:

1. User registers or logs in with credentials
2. Server validates credentials and returns a JWT token
3. Client stores the token and sends it with subsequent requests
4. Server validates the token for protected routes

## Test User Initialization

The module automatically initializes a test user on application startup if it doesn't exist. 

### Configuration Options

The test user initialization can be configured using environment variables:

- `NODE_ENV` - Only initializes in 'development' and 'test' environments
- `TEST_USER_EMAIL` - Email for the test user (default: 'test@example.co.il')
- `TEST_USER_PASSWORD` - Password for the test user (default: 'password')

To disable this feature in development, set `NODE_ENV=production`.

### Example .env Configuration

```
NODE_ENV=development
TEST_USER_EMAIL=test@example.co.il
TEST_USER_PASSWORD=password
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout (clear authentication cookie)

## Configuration

The module requires a JWT secret to be set in the environment variables:

```
JWT_SECRET=your_super_secure_jwt_secret_key
```

For development, you can add this to a `.env` file in the project root.

## JWT Settings

- Token expiration: 12 hours
- Cookie settings:
  - httpOnly: true (not accessible via JavaScript)
  - sameSite: strict (CSRF protection)
  - secure: true in production, false in development
  - maxAge: 12 hours

## Usage

Protected routes can use the JwtAuthGuard:

```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute() {
  // Only authenticated users can access this
}
```
