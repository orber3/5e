import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StocksController } from './controllers/stocks.controller';
import { FmpApiService } from './services/fmp-api.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [StocksController],
  providers: [FmpApiService],
  exports: [FmpApiService],
})
export class StocksModule {}
