import { ApiProperty } from '@nestjs/swagger';

export class UpdateNameDto {
  @ApiProperty({
    description: 'The updated name value',
    example: 'Updated Name',
    required: true,
  })
  name!: string;
}
