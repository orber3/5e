import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NameRepository } from '../repositories/name.repository';

@Injectable()
export class NameSeederService implements OnModuleInit {
  private readonly logger = new Logger(NameSeederService.name);

  constructor(private readonly nameRepository: NameRepository) {}

  async onModuleInit() {
    await this.seedNames();
  }

  async seedNames() {
    // Check if any names exist
    const count = await this.nameRepository.count();

    if (count === 0) {
      this.logger.log('No names found. Seeding initial data...');

      const initialNames = [
        'Alice',
        'Bob',
        'Charlie',
        'David',
        'Eva',
        'Frank',
        'Grace',
        'Hannah',
        'Ian',
        'Julia',
      ];

      for (const name of initialNames) {
        await this.nameRepository.create(name);
      }

      this.logger.log(`Seeded ${initialNames.length} names.`);
    } else {
      this.logger.log(`Found ${count} existing names. Skipping seeding.`);
    }
  }
}
