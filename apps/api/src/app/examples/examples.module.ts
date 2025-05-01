import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamplesController } from './examples.controller';
import { ExamplesService } from './examples.service';
import { Name, NameSchema } from './schemas/name.schema';
import { NameRepository } from './repositories/name.repository';
import { NameSeederService } from './services/name-seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Name.name, schema: NameSchema }]),
  ],
  controllers: [ExamplesController],
  providers: [ExamplesService, NameRepository, NameSeederService],
  exports: [ExamplesService],
})
export class ExamplesModule {}
