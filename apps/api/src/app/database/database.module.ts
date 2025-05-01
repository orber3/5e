import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/onboarding'
        );

        return {
          uri: mongoUri,

          // Connection options
          connectTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          serverSelectionTimeoutMS: 5000,

          // Connection pool settings
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('MongoDB connected successfully');
            });
            connection.on('error', (error: Error) => {
              console.error('MongoDB connection error:', error);
              console.log('MongoDB connection details:', { uri: mongoUri });
            });
            connection.on('disconnected', () => {
              console.log('MongoDB disconnected');
            });
            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
