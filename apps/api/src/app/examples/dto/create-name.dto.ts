import { ApiProperty } from '@nestjs/swagger';

export class CreateNameDto {
  @ApiProperty({
    description: 'The name to create',
    example: 'John Smith',
    required: true,
  })
  name!: string;
}
