# Docker Setup for Onboarding Application

This repository contains Docker configuration for running the React onboarding application with a NestJS API backend and MongoDB database.

## Prerequisites

- Docker
- Docker Compose

## Configuration

The following services are configured:

1. **Web Application (React)**:

   - Runs on port 3030
   - Built with Vite
   - Uses NGINX as the web server

2. **API Service (NestJS)**:

   - Runs on port 3000
   - Connects to MongoDB

3. **MongoDB**:
   - Runs on port 27017
   - Data is persisted using Docker volumes

## Development Environment Variables

The required environment variables are:

```
# API Environment Variables
NODE_ENV=development
API_PORT=3000
MONGODB_URI=mongodb://mongo:27017/onboarding

# Web Environment Variables
VITE_API_BASE_URL=http://localhost:3000/api
```

## Getting Started

1. Clone the repository
2. Build and start the services:

```bash
docker-compose up --build
```

3. Access the applications:
   - Web: http://localhost:3030
   - API: http://localhost:3000
   - MongoDB: mongodb://localhost:27017

## Development Workflow

The setup is optimized for development:

- The web container includes source maps
- The API container includes source maps for better debugging
- MongoDB data is persisted in a Docker volume

## Customizing the Configuration

- Web service configuration: See `nginx.dev.conf`
- API configuration: Environment variables in `docker-compose.yml`
- MongoDB configuration: Environment variables in `docker-compose.yml`

## Stopping the Services

To stop the services:

```bash
docker-compose down
```

To stop the services and remove the volumes:

```bash
docker-compose down -v
```
