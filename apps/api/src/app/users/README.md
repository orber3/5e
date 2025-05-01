# Users Module

This module provides user management functionality for the API:

## Features

- User CRUD operations
- MongoDB schema with Mongoose
- Repository pattern implementation
- Swagger documentation
- Password hashing with bcrypt

## API Endpoints

- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## User Schema

The user schema includes:

- Email (required, unique)
- Password (required, hashed)
- Timestamps (createdAt, updatedAt)

## Password Security

Passwords are automatically hashed using bcrypt before saving to the database.
The schema includes a pre-save hook that handles this process.

## Data Transformation

The schema includes transformation to:

- Convert MongoDB \_id to id in responses
- Remove sensitive fields (password) from responses
- Remove internal fields (\_\_v) from responses

## Usage

Protected user routes require authentication with JwtAuthGuard:

```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get(':id')
async getUserById(@Param('id') id: string) {
  return this.usersService.getUserById(id);
}
```
