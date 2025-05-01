import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio.module';
import { PortfolioController } from './controllers/portfolio.controller';
import { PortfolioService } from './services/portfolio.service';
import { PortfolioRepository } from './repositories/portfolio.repository';
import { StocksModule } from '../stocks/stocks.module';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';

describe('PortfolioModule (Integration)', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        HttpModule,
        MongooseModule.forRoot('mongodb://localhost:27017/test-db'),
        MongooseModule.forFeature([
          { name: Portfolio.name, schema: PortfolioSchema },
        ]),
        StocksModule,
        PortfolioModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should resolve PortfolioController', () => {
    const controller = module.get<PortfolioController>(PortfolioController);
    expect(controller).toBeDefined();
  });

  it('should resolve PortfolioService', () => {
    const service = module.get<PortfolioService>(PortfolioService);
    expect(service).toBeDefined();
  });

  it('should resolve PortfolioRepository', () => {
    const repository = module.get<PortfolioRepository>(PortfolioRepository);
    expect(repository).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
