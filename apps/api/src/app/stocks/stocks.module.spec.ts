import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { StocksModule } from './stocks.module';
import { StocksController } from './controllers/stocks.controller';
import { FmpApiService } from './services/fmp-api.service';

describe('StocksModule (Integration)', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        StocksModule,
        HttpModule,
        ConfigModule.forRoot(),
        CacheModule.register(),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should resolve StocksController', () => {
    const controller = module.get<StocksController>(StocksController);
    expect(controller).toBeDefined();
  });

  it('should resolve FmpApiService', () => {
    const service = module.get<FmpApiService>(FmpApiService);
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
