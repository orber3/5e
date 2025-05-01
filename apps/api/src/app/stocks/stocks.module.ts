import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { StocksController } from './controllers/stocks.controller';
import { FmpApiService } from './services/fmp-api.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    CacheModule.register({
      ttl: 15 * 60, // 15 minutes in seconds
      max: 100, // Maximum number of items in cache
    }),
  ],
  controllers: [StocksController],
  providers: [FmpApiService],
  exports: [FmpApiService],
})
export class StocksModule {}
