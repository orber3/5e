# Authentication Module

This module provides authentication functionality for the API:

## Features

- User registration
- User login with JWT token
- Cookie-based authentication with JWT fallback
- Protected routes with JWT guard
- Swagger documentation

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
