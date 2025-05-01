import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '60d21b4667d0d8992e610c85',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2023-06-15T14:25:53.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2023-06-15T14:25:53.000Z',
  })
  updatedAt!: Date;
}
