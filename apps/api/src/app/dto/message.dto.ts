import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({
    description: 'The message text',
    example: 'Hello API',
  })
  message!: string;
}
